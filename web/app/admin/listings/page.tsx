'use client';

import GenericButton, { createButtonDetails } from "@/app/components/fields/genericButton";
import { VehicleResult } from "@/app/components/resultsTable/resultsTable";
import AuthenticatedPage from "@/app/components/security/authenticatedPage";
import { VehicleFilter } from "@/app/services/vehicleService";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import useVehicleFilteringStore from "@/app/stores/vehicleFilteringStore";
import { useEffect, useState } from "react";

export default function ListingsPanel() {
    const headers = ['Added', 'Title', 'Description', 'Status', 'Action']
    const { doFilterReturnResult, setFilter } = useVehicleFilteringStore.getState();
    const statuses = ['AVAILABLE', 'MAINTENANCE', 'RENTED'];
    const { vehicleService, authenticationService } = useGlobalServiceStore();
    const [listings, setListings] = useState<VehicleResult[]>([])

    useEffect(() => {
        setFilter(new VehicleFilter("", true))
        const fetchMyListings = async () => {
            const response: VehicleFilter = await doFilterReturnResult(authenticationService.getToken());
            if (response.result) {
                setListings(response.result);
            }
        };
        fetchMyListings();
    }, [setListings])

    const handleStatusChange = (newStatus: string, vehicleId: number): void => {
        vehicleService.updateStatus(newStatus, vehicleId).then(response => {
            console.log(`RESPONSE ${response}`)
            if (response.success) {
                setListings([])
            } else {
                alert(response.message);
            }
        })

    }

    const createTableHeader = (id: number, label: string): React.ReactElement => {
        return (<th key={id} className=" min-w-[200px] cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
            {label}
        </th>);
    }

    const createStatus = (status: string): React.ReactElement | null => {
        let element: React.ReactElement | null = null;
        switch (status) {
            case 'AVAILABLE':
                element = <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-green-500/20 text-green-600 py-1 px-2 text-xs rounded-md" >
                    <span className="">Available</span>
                </div>;
                break;
            case 'MAINTENANCE':
                element = <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-yellow-500/20 text-yellow-600 py-1 px-2 text-xs rounded-md" >
                    <span className="">Maintenance</span>
                </div>;
                break;
            case 'RENTED':
                element = <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-red-500/20 text-red-700 py-1 px-2 text-xs rounded-md" >
                    <span className="">Rented</span>
                </div>
                break;
        }
        return element;
    }

    const createTableRow = (result: VehicleResult, id: number): React.ReactElement => {
        return (<tr key={id}>
            <td className="p-4 border-b border-blue-gray-50">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{result.age}</p>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{result.title}</p>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <div className="flex flex-col">
                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{result.description}</p>
                </div>
            </td>
            <td className="p-4">
                <div className="w-max">
                    {createStatus(result.status)}
                </div>
            </td>
            <td className="p-4">
                <div className="flex flex-col">
                    {statuses.filter(item => item !== result.status).map((status, id) =>
                        <GenericButton key={id} {...createButtonDetails(status, "button", () => handleStatusChange(status, result.id))} />
                    )}
                </div>
            </td>
        </tr>)
    }

    return (
        <AuthenticatedPage>
            <div className="flex justify-center items-center p-4 m-4 overflow- h-full px-0">
                <table className="mt-4 w-full h-full min-w-max table-auto text-left bg-gray-200">
                    <thead>
                        <tr>
                            {headers.map((head, key) => createTableHeader(key, head))}
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((result, key) => createTableRow(result, result.id))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedPage>)
}
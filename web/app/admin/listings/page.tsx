'use client';

import GenericButton, { createButtonDetails } from "@/app/components/fields/genericButton";
import AuthenticatedPage from "@/app/components/security/authenticatedPage";
import { VehicleFilter } from "@/app/services/vehicleService";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import useVehicleFilteringStore, { VehicleResult } from "@/app/stores/vehicleFilteringStore";
import { beautifyVehicleAge } from "@/app/utilities/stringUtils";
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
    }, [])

    const handleStatusChange = (newStatus: string, vehicleId: number): void => {
        vehicleService.updateStatus(newStatus, vehicleId).then(response => {
            console.log(`RESPONSE ${response}`)
            if (response.success) {
                const updatedListings = listings.map(v => v.id === vehicleId ? { ...v, status: newStatus } : v);
                setListings(updatedListings);
            } else {
                alert(response.message);
            }
        })

    }

    const createTableHeader = (id: number, label: string): React.ReactElement => {
        return (<th key={id} className=" min-w-[200px] cursor-pointer border-y p-4">
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
            <td className="p-4 w-[5%]">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{beautifyVehicleAge(result.age)}</p>
            </td>
            <td className="p-4 w-[35%]">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{result.title}</p>
            </td>
            <td className="p-4 w-[35%]">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{result.description}</p>
            </td>
            <td className="p-4 w-[5%]">
                {createStatus(result.status)}
            </td>
            <td className="p-4 w-[20%]">
                <div className="flex flex-row">
                    {statuses.filter(item => item !== result.status).map((status, id) =>
                        <GenericButton key={id} {...createButtonDetails(status, "button", () => handleStatusChange(status, result.id))} />
                    )}
                </div>
            </td>
        </tr>)
    }

    return (
        <AuthenticatedPage>
            <div className="bg-background text-foreground flex justify-center items-center p-4 m-4 overflow- h-full px-0">
                <table className="mt-4 w-full h-full table-auto text-left">
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
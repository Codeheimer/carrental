'use client';

import { Table } from "@/app/components/shadcn/table";
import { DataTable } from "@/app/components/tables/datatable";
import { VehicleFilter } from "@/app/services/vehicleService";
import useAuthStore from "@/app/stores/authStore";
import useVehicleFilteringStore, { VehicleResult } from "@/app/stores/vehicleFilteringStore";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

const columns: ColumnDef<VehicleResult>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "price",
        header: "Rate",
    },
]

export default function RentDashboard() {
    const { doFilterReturnResult } = useVehicleFilteringStore();
    const { session } = useAuthStore();
    const [listings, setListings] = useState<VehicleResult[]>([])

    useEffect(() => {
        const fetchMyRents = async (): Promise<void> => {
            if (session.userId) {
                const response = await doFilterReturnResult(session.token, VehicleFilter.withRenterId(Number(session.userId)));
                setListings(response.result);
            }
            return Promise.resolve();
        }

        fetchMyRents();
    }, [session.userId])

    return (<div className="flex flex-col h-screen w-screen">
        <div className="h-[50px] p-8 text-3xl">
            My Rents
        </div>
        <div className="h-full flex pt-2 justify-center">
            <DataTable columns={columns} data={listings} classNames={`w-[90%]`} />
        </div>
    </div>)
}
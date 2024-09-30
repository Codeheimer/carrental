import { useEffect } from "react";
import Card from "../card/card";
import useVehicleFilteringStore from "@/app/stores/vehicleFilteringStore";
import { VehicleFilterImpl, VehicleServiceImpl } from "@/app/services/vehicleService";

export interface VehicleResult {
    id: number
    title: string
    description: string
    ownerId: string
    owner: string
    age: string
    status: string
}
export default function ResultsTable() {
    const { results, doFilter, setFilter } = useVehicleFilteringStore();

    useEffect(() => {
        setFilter(new VehicleFilterImpl())
        doFilter()
    }, [doFilter, setFilter])

    return (
        <div className="m-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {results.map(card =>
                (<Card key={card.id} {...card} />)
            )}
        </div>)
}
import useVehicleFilteringStore from "@/app/stores/vehicleFilteringStore";
import GenericButton, { createButtonDetails } from "../fields/genericButton";
import { useEffect } from "react";
import { generateJSONFromForm } from "@/app/utilities/formUtils";
import { VehicleFilter } from "@/app/services/vehicleService";
import Textbox, { createTextboxDetails } from "../fields/textbox";

export default function VehicleSearch() {
    const { doFilter, setFilter } = useVehicleFilteringStore.getState();

    useEffect(() => {
        doFilter();
    });

    const handleSubmit = (event: React.FormEvent) => {
        const json: VehicleFilter = generateJSONFromForm(event) as VehicleFilter;
        setFilter(json);
        event.preventDefault();
        doFilter();
    }
    return (<div className="flex-1 p-1 justify-center h-full border-solid border-gray-200 rounded border-2 ">
        <form onSubmit={handleSubmit}>
            <Textbox {...createTextboxDetails("Search", "search")} />
            <Textbox {...createTextboxDetails("Make", "make")} />
            <GenericButton {...createButtonDetails("Filter", "submit")} />
        </form>
    </div>)
}
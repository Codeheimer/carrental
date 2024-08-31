'use client';

import { Vehicle } from "@/app/services/vehicleService";
import AuthenticatedPage from "../security/authenticatedPage";
import Textbox, { createTextboxDetails } from "../fields/textbox";
import GenericButton, { createButtonDetails } from "../fields/genericButton";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";

export default function AddNewVehicle() {
    const { vehicleService, authenticationService } = useGlobalServiceStore();

    const save = (event: React.FormEvent): void => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const jsonData: { [key: string]: any } = {};

        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        console.log(JSON.stringify(jsonData));

        vehicleService.save(jsonData as Vehicle,authenticationService.getToken());
    };

    return (<AuthenticatedPage>
        <div className="m-24 flex items-center flex-col">
            <form onSubmit={save}>
                <Textbox {...createTextboxDetails("Make", "make", true)} />
                <Textbox {...createTextboxDetails("Model", "model", true)} />
                <Textbox {...createTextboxDetails("Year", "year", true)} />
                <Textbox {...createTextboxDetails("Engine Displacement", "engineDisplacement", true)} />
                <Textbox {...createTextboxDetails("Seater", "seater", true)} />
                <Textbox {...createTextboxDetails("Description", "description", true)} />
                <GenericButton {...createButtonDetails("Add Listing", "submit")} />
            </form>
        </div>
    </AuthenticatedPage>)
}
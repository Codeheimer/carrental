'use client';

import { Vehicle } from "@/app/services/vehicleService";
import AuthenticatedPage from "../security/authenticatedPage";
import Textbox, { createTextboxDetails } from "../fields/textbox";
import GenericButton, { createButtonDetails } from "../fields/genericButton";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { useRouter } from "next/navigation";
import Textarea, { createTextareaDetails } from "../fields/textarea";

export default function AddNewVehicle() {
    const { vehicleService, authenticationService } = useGlobalServiceStore();
    const router = useRouter();

    const save = (event: React.FormEvent): void => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const jsonData: { [key: string]: any } = {};

        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        console.log(JSON.stringify(jsonData));

        vehicleService.save(jsonData as Vehicle, authenticationService.getToken()).then((response) => {
            if (response.success) {
                router.push("/")
            } else {
                alert(response.message);
            }
        });
    };

    return (
        <div className="m-3 flex items-center flex-col">
            <form onSubmit={save}>
                <Textbox {...createTextboxDetails("Plate Number", "plateNumber", true)} />
                <Textbox {...createTextboxDetails("Make", "make", true)} />
                <Textbox {...createTextboxDetails("Model", "model", true)} />
                <Textbox {...createTextboxDetails("Year", "year", true)} />
                <Textbox {...createTextboxDetails("Engine Displacement", "engineDisplacement", true)} />
                <Textbox {...createTextboxDetails("Seater", "seater", true)} />
                <Textbox {...createTextboxDetails("Title", "title", true)} />
                <Textarea {...createTextareaDetails("Description", "description", true)} />
                <GenericButton {...createButtonDetails("Add Listing", "submit")} />
            </form>
        </div>)
}
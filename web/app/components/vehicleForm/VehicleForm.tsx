'use client';

import { Vehicle } from "@/app/services/vehicleService";
import AuthenticatedPage from "../security/authenticatedPage";
import Textbox, { createTextboxDetails } from "../fields/textbox";
import GenericButton, { createButtonDetails } from "../fields/genericButton";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { useRouter } from "next/navigation";
import TextArea, { createTextareaDetails } from "../fields/textarea";
import { ChangeEvent, useState } from "react";
import FileUpload, { FileuploadDetails } from "../fields/fileUpload";
import "./input-style.css";

export default function AddNewVehicle() {
    const { vehicleService, authenticationService } = useGlobalServiceStore();
    const [images, setImages] = useState<FileList | null>(null)
    const router = useRouter();

    const save = (event: React.FormEvent): void => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const jsonData: { [key: string]: any } = {};


        if (images === null || images.length === 0) {
            alert("Please upload an image.");
            return;
        }

        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        const data = new FormData();
        data.append('vehicle', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

        Array.from(images).forEach((file, index) => {
            data.append(`pictures`, file);
        });

        vehicleService.save(data, authenticationService.getToken()).then((response) => {
            if (response.success) {
                router.push("/")
            } else {
                alert(response.message);
            }
        });
    };

    const handleVehicleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(e.target.files);
        }
    };

    const vehicleImageFileupload = new FileuploadDetails("Upload Images", "images", false, false, true, handleVehicleImageUpload, 'vehicle-images-upload');

    return (
        <AuthenticatedPage>
            <form onSubmit={save}>
                <div className="p-3 flex flex-col w-full min-h-full">
                    <div className="w-full mb-4 p-4 rounded-lg">
                        <h1 className="text-2xl font-bold text-center">Vehicle Details</h1>
                    </div>
                    <div className="flex flex-row justify-between items-stretch w-full">
                        <div className="m-2 p-2 flex flex-col h-full w-1/2 items-start">
                            <div className="m-2 p-2"><Textbox {...createTextboxDetails("Price","price",true)}/></div>
                            <div className="m-2 p-2"><FileUpload {...vehicleImageFileupload} /></div>
                        </div>
                        <div className="h-full w-1/2">
                            <Textbox {...createTextboxDetails("Plate Number", "plateNumber", true)} />
                            <Textbox {...createTextboxDetails("Make", "make", true)} />
                            <Textbox {...createTextboxDetails("Model", "model", true)} />
                            <Textbox {...createTextboxDetails("Year", "year", true)} />
                            <Textbox {...createTextboxDetails("Engine Displacement", "engineDisplacement", true)} />
                            <Textbox {...createTextboxDetails("Seater", "seater", true)} />
                            <Textbox {...createTextboxDetails("Title", "title", true)} />
                            <TextArea {...createTextareaDetails("Description", "description", true)} />
                            <GenericButton {...createButtonDetails("Add Listing", "submit")} />

                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedPage>)
}
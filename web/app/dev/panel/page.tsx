'use client';

import FileUpload, { FileuploadDetails } from "@/app/components/fields/fileUpload";
import GenericButton, { createButtonDetails } from "@/app/components/fields/genericButton";
import useAuthStore from "@/app/stores/authStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { ChangeEvent, useState } from "react";

export default function DevPanel() {
    const [addressJson, setAddressJson] = useState<File>()
    const { adminService } = useGlobalServiceStore();
    const { session } = useAuthStore();

    const handleUploadAddressJson = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            setAddressJson(e.target.files[0])
        }
    }
    const handleSubmitAddressJson = (): void => {
        const formData = new FormData();
        if (addressJson) {
            formData.append("addressJson", addressJson);
            adminService.uploadAddressJson(formData);
        }
    }
    return (<div className="flex flex-col w-full h-full justify-center items-center container mx-auto p-6">
        <div>
            <FileUpload {...new FileuploadDetails("Address Json", "addressJson", false, false, false, handleUploadAddressJson)} />
            <GenericButton {...createButtonDetails("Upload", "button", handleSubmitAddressJson)} />
        </div>
    </div>)
}
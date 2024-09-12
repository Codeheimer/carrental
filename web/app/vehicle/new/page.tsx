'use client';
import AuthenticatedPage from "@/app/components/security/authenticatedPage";
import AddNewVehicle from "@/app/components/vehicleForm/VehicleForm";

export default function NewVehicle() {
    return (<AuthenticatedPage>
        <div className="flex justify-center h-screen">
            <AddNewVehicle />
        </div>
    </AuthenticatedPage>)
}
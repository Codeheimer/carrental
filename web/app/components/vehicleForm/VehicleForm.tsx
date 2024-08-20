'use client';

import { saveVehicle, Vehicle } from "@/app/services/vehicleService";

export default function AddNewVehicle() {

    const save = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const jsonData: { [key: string]: any } = {};

        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        console.log(JSON.stringify(jsonData));

        saveVehicle(jsonData as Vehicle)
    };

    return (<div className="m-24 flex items-center flex-col">
        <form onSubmit={save}>
            <div>
                <label htmlFor="inputname" className="block text-gray-800 font-semibold text-sm"
                >Make</label
                >
                <div className="mt-2">
                    <input
                        type="text"
                        name="make"
                        className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="inputname" className="block text-gray-800 font-semibold text-sm"
                >Model</label
                >
                <div className="mt-2">
                    <input
                        type="text"
                        name="model"
                        className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="inputname" className="block text-gray-800 font-semibold text-sm"
                >Year</label
                >
                <div className="mt-2">
                    <input
                        type="text"
                        name="year"
                        className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="inputname" className="block text-gray-800 font-semibold text-sm"
                >Engine Displacement</label
                >
                <div className="mt-2">
                    <input
                        type="text"
                        name="engineDisplacement"
                        className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="inputname" className="block text-gray-800 font-semibold text-sm"
                >Seater</label
                >
                <div className="mt-2">
                    <input
                        type="text"
                        name="seater"
                        className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="inputname" className="block text-gray-800 font-semibold text-sm"
                >Description</label
                >
                <div className="mt-2">
                    <input
                        type="text"
                        name="description"
                        className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                    />
                </div>
            </div>
            <div className="my-4">  
                <button type="submit" className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
 border-blue-600">
                    Add Listing
                </button>
            </div>
        </form>

    </div>)
}
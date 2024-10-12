'use client'

import VehiclePreviewCard from "@/app/components/card/vehiclePreviewCard";
import { ParticipantResponse, ParticipantResponseImpl } from "@/app/services/participantService";
import useAuthStore from "@/app/stores/authStore"
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListingUserProfile() {
    const { session } = useAuthStore();
    const { participantService } = useGlobalServiceStore();
    const [profile, setProfile] = useState<ParticipantResponse>(new ParticipantResponseImpl());
    const { userId } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await participantService.fetch(userId as string);
            if (response) {
                setProfile(response)
            }
        }

        const user = fetchUser();
    }, []);

    return (<div>
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                <div className="col-span-4 sm:col-span-3">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h1>
                        </div>
                        <hr className="my-6 border-t border-gray-300" />
                        <div className="flex flex-col">
                            <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Information</span>
                            <ul>
                                <li className="mb-2">Email: {profile.email}</li>
                                <li className="mb-2">Phone: {profile.phoneNumber}</li>
                                <li className="mb-2">Address: {profile.address}</li>
                                <li className="mb-2">Birthdate: {profile.birthdate}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 sm:col-span-9">
                    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                        <h2 className="text-xl font-bold mb-4">My Listings</h2>
                        <div className="flex flex-col">
                            {Array.from({ length: 2 }, (_, index) => (
                                <VehiclePreviewCard key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}
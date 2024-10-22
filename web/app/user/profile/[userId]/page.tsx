'use client'

import VehiclePreviewCard from "@/app/components/card/vehiclePreviewCard";
import { ParticipantResponse, ParticipantResponseImpl } from "@/app/services/participantService";
import { VehicleFilter } from "@/app/services/vehicleService";
import useAuthStore from "@/app/stores/authStore"
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import useVehicleFilteringStore, { VehicleResult } from "@/app/stores/vehicleFilteringStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListingUserProfile() {
    const [renterListings, setRenterListings] = useState<VehicleResult[]>([]);
    const { doFilterReturnResult } = useVehicleFilteringStore();
    const { participantService } = useGlobalServiceStore();
    const [profile, setProfile] = useState<ParticipantResponse>(new ParticipantResponseImpl());
    const { userId } = useParams();

    useEffect(() => {
        const filterRenterOtherListings = async () => {
            const filter = VehicleFilter.withOwnerId(Number(profile.id));
            const response = await doFilterReturnResult(null, filter);

            if (response) {
                setRenterListings(response.result);
            }
        }

        const fetchUser = async () => {
            const response = await participantService.fetch(userId as string);
            if (response) {
                setProfile(response)
            }
        }

        fetchUser();
        filterRenterOtherListings();
    }, []);

    return (<div>
        <div className="bg-background text-foreground container mx-auto py-8">
            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                <div className="col-span-4 sm:col-span-3">
                    <div className="rounded-xl shadow-lg p-6">
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h1>
                        </div>
                        <hr className="my-6 border-t border-gray-300" />
                        <div className="flex flex-col">
                            <span className="uppercase font-bold tracking-wider mb-2">Information</span>
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
                    <div className="rounded-xl shadow-lg p-6 min-h-full">
                        <h2 className="text-xl font-bold mb-4">My Listings</h2>
                        <div className="grid grid-cols-4 grid-rows-5">
                            {renterListings.map((listing, index) => (
                                <VehiclePreviewCard {...listing} key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}
'use client';
import VehiclePreviewCard from "@/app/components/card/vehiclePreviewCard";
import GenericButton, { createButtonDetails } from "@/app/components/fields/genericButton";
import ImageLoader from "@/app/components/images/imageLoader";
import { Vehicle, VehicleFilter } from "@/app/services/vehicleService";
import useAuthStore from "@/app/stores/authStore";
import useChatStore, { ConversationImpl } from "@/app/stores/chatStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import useVehicleFilteringStore, { VehicleResult } from "@/app/stores/vehicleFilteringStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


export default function VehicleListingModule({ params }: { params: { vehicleId: string } }) {
    const { chatOpen, toggleChat, setCurrentConversation, setConversations, conversations } = useChatStore();
    const { vehicleService } = useGlobalServiceStore();
    const { session } = useAuthStore();
    const { doFilterReturnResult } = useVehicleFilteringStore();
    const [listing, setListing] = useState<Vehicle>(new Vehicle());
    const [renterListings, setRenterListings] = useState<VehicleResult[]>([]);
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (scrollRef.current) {
                e.preventDefault();
                scrollRef.current.scrollLeft += e.deltaY;
            }
        };

        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    useEffect(() => {
        const filterRenterOtherListings = async () => {
            const filter = VehicleFilter.withOwnerId(listing.ownerId);
            const response = await doFilterReturnResult(null, filter);

            if (response) {
                const updatedResult = response.result.filter(v => v.id == Number(params.vehicleId) ? null : v)
                setRenterListings(updatedResult);
            }
        }

        const fetchVehicle = () => {
            vehicleService.fetch(params.vehicleId).then((response) => {
                setListing(response);
            })
        }
        fetchVehicle();
        filterRenterOtherListings();
    }, [params.vehicleId, vehicleService])

    const handleInitiateChatWithRenter = (listingOwnerId: number, owner: string) => {
        if (!session.loggedIn) {
            router.push("/login");
            return;
        }
        if (!chatOpen) {
            const existingConversation = conversations.find(c => Number(c.sendToId) === Number(listingOwnerId));
            if (!existingConversation) {
                const newConversation = new ConversationImpl("0", String(listingOwnerId), owner);
                setCurrentConversation(newConversation);
                const updatedConversations = [...conversations, newConversation];
                setConversations(updatedConversations);
            } else {
                setCurrentConversation(existingConversation);
            }
            toggleChat();
        }
    }

    const createVehicleTableSpec = () => {
        const border = 'border border-slate-600'
        const tdClass = `${border} pt-5 pb-5 px-40`;
        return (
            <table className={`m-2 text-center border-collapse ${border}`}>
                <tbody>
                    <tr>
                        <td className={tdClass}>Make</td>
                        <td className={tdClass}>{listing.make}</td>
                    </tr>
                    <tr>
                        <td className={tdClass}>Model</td>
                        <td className={tdClass}>{listing.model}</td>
                    </tr>
                    <tr>
                        <td className={tdClass}>Year</td>
                        <td className={tdClass}>{listing.year}</td>
                    </tr>
                    <tr>
                        <td className={tdClass}>Engine Displacement</td>
                        <td className={tdClass}>{listing.engineDisplacement}</td>
                    </tr>
                    <tr>
                        <td className={tdClass}>Seater</td>
                        <td className={tdClass}>{listing.seater}</td>
                    </tr>
                </tbody>
            </table>)
    }

    const isLoggedInUserSameAsListingOwner = (): boolean => {
        console.log(`${Number(session.userId ? session.userId : 0)} === ${listing.ownerId}`)
        return Number(session.userId ? session.userId : 0) === Number(listing.ownerId);
    }

    const handleClickRenter = () => {
        router.push(`/user/profile/${listing.ownerId}`);
    }

    return (
        <div className="flex flex-col items-start justify-center py-6 2xl:px-10 md:px-6 px-4 min-h-screen">
            <div className="flex flex-row w-full">
                {listing.pictures.map((url, key) =>
                    <ImageLoader objectFit={'contain'} key={key} src={url} alt={`picture`} className={`flex flex-col m-6 xl:w-1/2 w-full rounded-xl shadow-lg overflow-hidden`} />)
                }
                <div className="flex flex-col m-6 xl:w-1/2 xl:h-fit items-end">
                    <div className="py-4">
                        <div className="py-8 px-8 max-w-sm mx-auto bg-background border border-solid border-transparent dark:border-gray-600 rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
                            <ImageLoader onClickAction={handleClickRenter} src={listing.ownerProfile} alt="profile picture" className={`hover:cursor-pointer block mx-auto rounded-full sm:mx-0 sm:shrink-0`} />
                            <div className="text-center space-y-2 sm:text-left">
                                <div className="space-y-0.5">
                                    <p className="text-lg font-semibold">
                                        {listing.owner}
                                    </p>
                                </div>
                                {!isLoggedInUserSameAsListingOwner() && <GenericButton {...createButtonDetails('Contact Renter', "button", () => handleInitiateChatWithRenter(listing.ownerId, listing.owner))} />}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-solid border-transparent dark:border-gray-600 shadow-lg py-8 px-8 w-full mx-auto xl:h-1/2">
                        <div className="flex flex-row justify-between">
                            <div className="py-3">
                                <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 mt-2">
                                    {listing.title}
                                </h1>
                            </div>
                            <div className="py-5">
                                <span className="font-bold text-xl text-red-600 dark:text-red-400">${listing.price}<span className="text-sm font-normal">/day</span></span>
                            </div>
                        </div>
                        <div className="text-base lg:leading-tight leading-normal text-gray-600 dark:text-gray-300 mt-2 overflow-hidden">
                            <p className="line-clamp-4 sm:line-clamp-6 md:line-clamp-none">
                                {listing.description}
                            </p>
                            <div className="mt-8 mb-8 border-t border-gray-200"></div>
                            <p className="font-bold text-lg">Specifications:</p>
                            {createVehicleTableSpec()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full p-4 rounded-xl shadow-lg min-h-[391px]">
                <div>More from renter</div>
                <div ref={scrollRef} className="flex flex-row">
                    {renterListings.map((listing, index) => (
                        <VehiclePreviewCard {...listing} key={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}
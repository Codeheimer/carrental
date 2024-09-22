'use client';
import GenericButton, { createButtonDetails } from "@/app/components/fields/genericButton";
import { VehicleResult } from "@/app/components/resultsTable/resultsTable";
import useChatStore, { ConversationImpl } from "@/app/stores/chatStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { useEffect, useState } from "react";


export default function VehicleListingModule({ params }: { params: { vehicleId: string } }) {
    const { chatOpen, toggleChat, setCurrentConversation, setConversations, conversations } = useChatStore();
    const { chatService, vehicleService } = useGlobalServiceStore();
    const [listing, setListing] = useState<VehicleResult>({} as VehicleResult);
    useEffect(() => {
        const fetchVehicle = () => {
            vehicleService.fetch(params.vehicleId).then((response) => {
                setListing(response);
            })
        }
        fetchVehicle();
    }, [params.vehicleId, vehicleService])

    const handleInitiateChatWithRenter = (ownerId: string, owner: string) => {
        if (!chatOpen) {
            const newConversation = new ConversationImpl(0, ownerId, owner, false, "", null, []);
            setCurrentConversation(newConversation);
            const updatedConversations = [...conversations, newConversation];
            setConversations(updatedConversations);
            toggleChat();
        }
    }

    return (<div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">

        <div className="xl:w-2/6 lg:w-2/5 w-80 h-[47rem] md:block hidden">
            <div className="bg-slate-500 w-full h-full"></div>
        </div>
        <div className="flex flex-col m-6">
            <div className="border-b border-gray-200 pb-6">
                <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 mt-2">{listing.title}</h1>
            </div>
            <div>
                <p className="xl:pr-48 text-base lg:leading-tight leading-normal text-gray-600 dark:text-gray-300 mt-7">{listing.description}</p>
            </div>
            <div>
                <div className="border-t py-4 mt-7 border-gray-200">
                    <div data-menu className="flex justify-between items-center cursor-pointer">
                        <GenericButton {...createButtonDetails('Contact Renter', "button", () => handleInitiateChatWithRenter(listing.ownerId, listing.owner))} />
                    </div>
                    <div className="hidden pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 dark:text-gray-300" id="sect">You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are nonrefundable</div>
                </div>
            </div>
        </div>
    </div>)
}
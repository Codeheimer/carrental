import { VehicleResult } from "@/app/stores/vehicleFilteringStore";
import ImageLoader from "../images/imageLoader";
import { useRouter } from "next/navigation";

export default function VehiclePreviewCard(listing: VehicleResult) {
    const router = useRouter();

    const handleViewListing = (id: number): void => {
        router.push(`/vehicle/listing/${id}`);
    }

    return (<div onClick={() => handleViewListing(listing.id)} className="hover:cursor-pointer bg-background font-foreground justify-evenly w-60 h-80 p-3 flex flex-col rounded-2xl m-2">
        <div className="h-[1/2] min-w-full rounded-xl ">
            {listing.pictures.map((img, key) =>
                <ImageLoader ratio1to1={true} layout={'fill'} objectFit={'fill'} key={key} src={img} alt={`picture`} className={`"min-h-full min-w-full relative bg-gray-700 rounded-xl`} />
            )}
        </div>
        <div className="flex flex-col justify-start items-start h-[1/2]">
            <div className="text-xl font-bold overflow-hidden text-ellipsis line-clamp-2">
                {listing.title}
            </div>
            <div><span className="font-bold  text-red-600">${listing.price}</span></div>
        </div>
    </div>)
}
export default function VehiclePreviewCard() {
    return (<div className="bg-background font-foreground flex-shrink-0 w-60 h-80 p-3 flex flex-col gap-1 rounded-2xl mr-4">
        <div className="h-48 bg-gray-700 rounded-xl"></div>
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-start items-start">
                <div className="flex flex-col">
                    <span className="text-xl font-bold">Long Chair</span>
                    <p className="text-xs">ID: 23432252</p>
                </div>
                <span className="font-bold  text-red-600">$25.99</span>
            </div>
        </div>
    </div>)
}
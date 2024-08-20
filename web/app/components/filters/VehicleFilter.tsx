import FilterField from "./filterComponents/filterInput";

export default function VehicleFilter() {
    return (<div className="flex-1 p-1 justify-center h-full border-solid border-gray-200 rounded border-2 ">
        <form>
            <FilterField label={'Search'} />
        </form>
    </div>)
}
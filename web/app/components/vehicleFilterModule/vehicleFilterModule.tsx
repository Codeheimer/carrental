import VehicleSearch from "../filters/VehicleFilter";
import ResultsTable from "../resultsTable/resultsTable";

export default function VehicleFilterModule() {
    return (<div className="flex h-screen">
        <VehicleSearch />
        <ResultsTable />
    </div>)
}
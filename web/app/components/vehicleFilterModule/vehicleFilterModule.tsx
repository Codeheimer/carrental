import VehicleFilter from "../filters/VehicleFilter";
import ResultsTable from "../resultsTable/resultsTable";

export default function VehicleFilterModule() {
    return (<div className="flex h-screen">
        <VehicleFilter />
        <ResultsTable />
    </div>)
}
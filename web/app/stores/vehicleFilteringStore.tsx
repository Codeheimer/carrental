import { create } from "zustand";
import { VehicleResult } from "../components/resultsTable/resultsTable";
import { VehicleFilter, VehicleFilterImpl } from "../services/vehicleService";
import useGlobalServiceStore from "./globalServiceStore";

interface VehicleFilteringStore {
    filter: VehicleFilter;
    setFilter: (newFilter: VehicleFilter) => void;
    doFilter: (token?: string | null) => void;
    doFilterReturnResult: (token?: string | null) => Promise<VehicleResult[]>;
    results: VehicleResult[];
}

const useVehicleFilteringStore = create<VehicleFilteringStore>((set, get) => ({
    filter: new VehicleFilterImpl(),
    setFilter: (newFilter: VehicleFilter) => {
        set({ filter: newFilter });
    },
    doFilter: async (token: string | null = null) => {
        const { vehicleService } = useGlobalServiceStore.getState();
        const filter = get().filter;
        try {
            await vehicleService.filter(filter, token).then((response) => {
                set({ results: response })
            });
        } catch (error) {
            console.error("Error filtering, reason: ", error);
            return [];
        }
    },
    doFilterReturnResult: async (token: string | null = null): Promise<VehicleResult[]> => {
        const { vehicleService } = useGlobalServiceStore.getState();
        const filter = get().filter;
        try {
            const response = await vehicleService.filter(filter, token);
            return response;
        } catch (error) {
            console.error("Error filtering, reason: ", error);
            return [];
        }
    },
    results: []
}));

export default useVehicleFilteringStore;
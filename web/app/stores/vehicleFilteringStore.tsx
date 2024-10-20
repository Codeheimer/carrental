import { create } from "zustand";
import { VehicleFilter } from "../services/vehicleService";
import useGlobalServiceStore from "./globalServiceStore";

export interface VehicleResult {
    id: number
    title: string
    description: string
    ownerId: string
    owner: string
    age: string
    status: string
    pictures: string[]
    price: number
}

interface VehicleFilteringStore {
    filter: VehicleFilter;
    setFilter: (newFilter: VehicleFilter) => void;
    doFilter: (token?: string | null) => void;
    doFilterReturnResult: (token?: string | null, filter?: VehicleFilter) => Promise<VehicleFilter>;
}

const useVehicleFilteringStore = create<VehicleFilteringStore>((set, get) => ({
    filter: new VehicleFilter(),
    setFilter: (newFilter: VehicleFilter) => {
        set({ filter: newFilter });
    },
    doFilter: async (token: string | null = null) => {
        const { vehicleService } = useGlobalServiceStore.getState();
        const filter = get().filter;
        try {
            await vehicleService.filter(filter, token).then((response) => {
                set({ filter: response })
            });
        } catch (error) {
            console.error("Error filtering, reason: ", error);
            return [];
        }
    },
    doFilterReturnResult: async (token: string | null = null, filter: VehicleFilter = get().filter): Promise<VehicleFilter> => {
        const { vehicleService } = useGlobalServiceStore.getState();
        try {
            const response = await vehicleService.filter(filter, token);
            return response;
        } catch (error) {
            console.error("Error filtering, reason: ", error);
            return filter;
        }
    },
    results: []
}));

export default useVehicleFilteringStore;
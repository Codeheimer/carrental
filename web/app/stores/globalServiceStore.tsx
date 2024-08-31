import { create } from "zustand";
import { AuthenticationService, AuthenticationServiceImpl } from "../services/authenticationService";
import { RegistrationService, RegistrationServiceImpl } from "../services/registrationService";
import { VehicleService, VehicleServiceImpl } from "../services/vehicleService";

interface GlobalServiceStore {
    authenticationService: AuthenticationService,
    registrationService: RegistrationService,
    vehicleService: VehicleService
}

const useGlobalServiceStore = create<GlobalServiceStore>((set) => ({
    authenticationService: new AuthenticationServiceImpl(),
    registrationService: new RegistrationServiceImpl(),
    vehicleService: new VehicleServiceImpl()
}))

export default useGlobalServiceStore;
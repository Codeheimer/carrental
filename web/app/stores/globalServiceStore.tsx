import { create } from "zustand";
import { AuthenticationService, AuthenticationServiceImpl } from "../services/authenticationService";
import { RegistrationService, RegistrationServiceImpl } from "../services/registrationService";

interface GlobalServiceStore {
    authenticationService: AuthenticationService,
    registrationService: RegistrationService
}

const useGlobalServiceStore = create<GlobalServiceStore>((set) => ({
    authenticationService: new AuthenticationServiceImpl(),
    registrationService: new RegistrationServiceImpl()
}))

export default useGlobalServiceStore;
import { create } from "zustand";
import { AuthenticationService, AuthenticationServiceImpl } from "../services/authenticationService";
import { RegistrationService, RegistrationServiceImpl } from "../services/registrationService";
import { VehicleService, VehicleServiceImpl } from "../services/vehicleService";
import { ChatService, ChatServiceImpl } from "../services/chatService";

interface GlobalServiceStore {
    authenticationService: AuthenticationService,
    registrationService: RegistrationService,
    vehicleService: VehicleService,
    chatService: ChatService
}

const useGlobalServiceStore = create<GlobalServiceStore>((set) => ({
    authenticationService: new AuthenticationServiceImpl(),
    registrationService: new RegistrationServiceImpl(),
    vehicleService: new VehicleServiceImpl(),
    chatService: new ChatServiceImpl()
}))

export default useGlobalServiceStore;
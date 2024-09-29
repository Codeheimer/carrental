import { create } from "zustand";
import { AuthenticationService, AuthenticationServiceImpl } from "../services/authenticationService";
import { RegistrationService, RegistrationServiceImpl } from "../services/registrationService";
import { VehicleService, VehicleServiceImpl } from "../services/vehicleService";
import { ChatService, ChatServiceImpl } from "../services/chatService";
import { AdminService, AdminServiceImpl } from "../services/adminService";
import { ResourceService, ResourceServiceImpl } from "../services/resourceService";

interface GlobalServiceStore {
    authenticationService: AuthenticationService,
    registrationService: RegistrationService,
    vehicleService: VehicleService,
    chatService: ChatService,
    adminService: AdminService,
    resourceService: ResourceService
}

const useGlobalServiceStore = create<GlobalServiceStore>((set) => ({
    authenticationService: new AuthenticationServiceImpl(),
    registrationService: new RegistrationServiceImpl(),
    vehicleService: new VehicleServiceImpl(),
    chatService: new ChatServiceImpl(),
    adminService: new AdminServiceImpl(),
    resourceService: new ResourceServiceImpl()
}))

export default useGlobalServiceStore;
import { create } from "zustand";
import { AuthenticationService, AuthenticationServiceImpl } from "../services/authenticationService";
import { RegistrationService, RegistrationServiceImpl } from "../services/registrationService";
import { VehicleService } from "../services/vehicleService";
import { ChatService, ChatServiceImpl } from "../services/chatService";
import { AdminService, AdminServiceImpl } from "../services/adminService";
import { ResourceService, ResourceServiceImpl } from "../services/resourceService";
import { ParticipantService, ParticipantServiceImpl } from "../services/participantService";
import { GeolocationService, GeolocationServiceImpl } from "../services/geolocationService";
import { UtilityService, UtilityServiceImpl } from "../services/utilityService";

interface GlobalServiceStore {
    authenticationService: AuthenticationService,
    registrationService: RegistrationService,
    vehicleService: VehicleService,
    chatService: ChatService,
    adminService: AdminService,
    resourceService: ResourceService,
    participantService: ParticipantService,
    geolocationService: GeolocationService,
    utilityService: UtilityService
}

const useGlobalServiceStore = create<GlobalServiceStore>((set) => ({
    authenticationService: new AuthenticationServiceImpl(),
    registrationService: new RegistrationServiceImpl(),
    vehicleService: new VehicleService(),
    chatService: new ChatServiceImpl(),
    adminService: new AdminServiceImpl(),
    resourceService: new ResourceServiceImpl(),
    participantService: new ParticipantServiceImpl(),
    geolocationService: new GeolocationServiceImpl(),
    utilityService: new UtilityServiceImpl()

}))

export default useGlobalServiceStore;
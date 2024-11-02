import { UserRoles } from "../enums/userRoles"

export interface IResponse {
    success: boolean,
    message: string
}

export interface AuthenticationResponse extends IResponse {
    id: string,
    token: string,
    message: string,
    admin: boolean,
    roles: UserRoles[],
    displayName: string
}



export interface VehicleSaveResponse extends IResponse {
    feedbackId: number
}

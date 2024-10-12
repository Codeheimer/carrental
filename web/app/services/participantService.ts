import { AxiosRequestConfig } from "axios"
import { BaseService } from "./baseService"

export interface ParticipantResponse {
    id: string,
    firstName: string,
    lastName: string,
    birthdate: string,
    gender: string,
    address: string,
    phoneNumber: string,
    email: string
}

export class ParticipantResponseImpl implements ParticipantResponse {
    constructor(
        public id: string = "",
        public firstName: string = "",
        public lastName: string = "",
        public birthdate: string = "",
        public gender: string = "",
        public address: string = "",
        public phoneNumber: string = "",
        public email: string = ""
    ) { }
}

export interface ParticipantService {
    fetch: (id: string) => Promise<ParticipantResponse>
}

export class ParticipantServiceImpl extends BaseService implements ParticipantService {
    public fetch = async (id: string): Promise<ParticipantResponse> => {
        const URL = `${this.getBaseURL()}/user/${id}`
        const axiosConfig: AxiosRequestConfig = {
            method: 'GET',
            headers: this.getHeaders(),
        }

        const response = await this.doRequest<ParticipantResponse>(URL, axiosConfig);
        return response;
    }
}
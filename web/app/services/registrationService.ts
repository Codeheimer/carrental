import { AxiosRequestConfig } from "axios";
import { RegistrationDetails } from "../register/page";
import { BaseService } from "./baseService";

interface RegistrationResponse {
    message: string
}

export interface RegistrationService {
    register: (details: RegistrationDetails | FormData, headers?: Record<string, string>) => Promise<string>,
    getHeaders: () => Record<string, string>
}

export class RegistrationServiceImpl extends BaseService implements RegistrationService {
    private REGISTER = process.env.REGISTER;

    public register = async (details: RegistrationDetails | FormData): Promise<string> => {
        const URL = `${this.getBaseURL()}${this.REGISTER}`;
        const axiosConfig: AxiosRequestConfig = {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: details

        }
        const response = await this.doRequest<RegistrationResponse>(URL, axiosConfig);

        return response.message;
    }
}
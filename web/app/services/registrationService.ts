import { AxiosRequestConfig } from "axios";
import { BaseService } from "./baseService";

interface RegistrationResponse {
    message: string,
    success:boolean
}

export interface RegistrationService {
    register: (details: FormData, headers?: Record<string, string>) => Promise<RegistrationResponse>,
    getHeaders: () => Record<string, string>
}

export class RegistrationServiceImpl extends BaseService implements RegistrationService {
    private REGISTER = process.env.REGISTER;

    public register = async (details: FormData): Promise<RegistrationResponse> => {
        const URL = `${this.getBaseURL()}${this.REGISTER}`;
        const axiosConfig: AxiosRequestConfig = {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: details

        }
        const response = await this.doRequest<RegistrationResponse>(URL, axiosConfig);

        return response;
    }
}
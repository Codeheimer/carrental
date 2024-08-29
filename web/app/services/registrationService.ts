import { RegistrationDetails } from "../register/page";
import { BaseService } from "./baseService";

interface RegistrationResponse {
    message: string
}

export interface RegistrationService {
    register: (details: RegistrationDetails) => Promise<string>
}

export class RegistrationServiceImpl extends BaseService implements RegistrationService {
    private REGISTER = process.env.REGISTER;

    public register = async (details: RegistrationDetails): Promise<string> => {
        const URL = `${this.getBaseURL()}${this.REGISTER}`;

        const response = await this.doRequest<RegistrationResponse>(URL, {
            method: 'POST',
            headers: this.getHeaders(),
            data: { ...details }

        });
        
        return response.message;
    }
}
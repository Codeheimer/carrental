import { AxiosRequestConfig } from 'axios';
import { BaseService } from './baseService';
import useGlobalServiceStore from '../stores/globalServiceStore';

export interface Vehicle {
    make: string
    model: string
    year: string
    engineDisplacement: string
    seater: number
    description: string
    owner: number
    latitude: number
    longitude: number
}

export interface VehicleSaveResponse {

}

export interface VehicleService {
    save: (vehicle: Vehicle, token: string | null) => VehicleSaveResponse
}

export class VehicleServiceImpl extends BaseService implements VehicleService {
    private SAVE = process.env.VEHICLE_SAVE_API;

    public save = async (vehicle: Vehicle, token: string | null): Promise<VehicleSaveResponse> => {
        try {
            const URL = `${this.getBaseURL()}${this.SAVE}`;
            const axiosConfig: AxiosRequestConfig = {
                method: 'POST',
                headers: this.getHeaders(token),
                data: { ...vehicle }
            }
            const response = await this.doRequest<VehicleSaveResponse>(URL, axiosConfig);

            return response;
        } catch (error) {
            console.error('error:', error);
            throw error;
        }
    };
}
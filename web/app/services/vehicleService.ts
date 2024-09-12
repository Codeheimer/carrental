import { AxiosRequestConfig } from 'axios';
import { BaseService } from './baseService';
import { VehicleResult } from '../components/resultsTable/resultsTable';

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
    message: string,
    success: boolean
}

export interface VehicleFilter {
    search: string,
    own: boolean
}

export interface VehicleService {
    save: (vehicle: Vehicle, token: string | null) => Promise<VehicleSaveResponse>;
    filter: (filter: VehicleFilter, token?: string | null) => Promise<VehicleResult[]>;
    fetch: (id: string) => Promise<VehicleResult>;
    updateStatus: (newStatus: string, vehicleId: number) => Promise<VehicleSaveResponse>;

}

export class VehicleFilterImpl implements VehicleFilter {
    search: string;
    own: boolean;

    constructor(search: string = "", own: boolean = false) {
        this.search = search;
        this.own = own;
    }
}

export class VehicleServiceImpl extends BaseService implements VehicleService {

    public save = async (vehicle: Vehicle, token: string | null): Promise<VehicleSaveResponse> => {
        try {
            const URL = `${this.getBaseURL()}${process.env.VEHICLE_SAVE}`;
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

    public filter = async (filter: VehicleFilter, token?: string | null): Promise<VehicleResult[]> => {
        try {

            const URL = `${this.getBaseURL()}${process.env.VEHICLE_FILTER}`;
            const axiosConfig: AxiosRequestConfig = {
                method: 'POST',
                headers: this.getHeaders(token),
                data: { ...filter }
            }
            const response = await this.doRequest<VehicleResult[]>(URL, axiosConfig);

            return response;
        } catch (error) {
            console.error('error:', error);
            throw error;
        }
    }

    public fetch = async (id: string): Promise<VehicleResult> => {
        try {
            const URL = `${this.getBaseURL()}${process.env.VEHICLE_FILTER}${id}`;
            const axiosConfig: AxiosRequestConfig = {
                method: 'GET',
                headers: this.getHeaders()
            }
            const response = await this.doRequest<VehicleResult>(URL, axiosConfig);

            return response;
        } catch (error) {
            console.error('error:', error);
            throw error;
        }
    }

    public updateStatus = async (newStatus: string, vehicleId: number): Promise<VehicleSaveResponse> => {
        try {
            const URL = `${this.getBaseURL()}${process.env.VEHICLE_STATUS_UPDATE}`;
            const axiosConfig: AxiosRequestConfig = {
                method: 'PUT',
                headers: this.getHeaders(),
                data: { vehicleId: vehicleId, status: newStatus }
            }
            const response = await this.doRequest<VehicleSaveResponse>(URL, axiosConfig);

            return response;
        } catch (error) {
            console.error('error:', error);
            throw error;
        }
    }
}
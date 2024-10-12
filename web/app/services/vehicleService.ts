import { AxiosRequestConfig } from 'axios';
import { BaseService } from './baseService';
import { VehicleResult } from '../stores/vehicleFilteringStore';

export interface Vehicle {
    plateNumber: string
    make: string
    model: string
    year: string
    engineDisplacement: string
    seater: number
    description: string
    owner: number
    latitude: number
    longitude: number
    title: string
}

export interface VehicleSaveResponse {
    message: string,
    success: boolean
}

export interface IVehicleFilter {
    search?: string;
    make?: string;
    model?: string;
    year?: string;
    engineDisplacement?: string;
    seater?: number;
    own?: boolean;
    result?: VehicleResult[];
    pageNumber?: number;
    pageSize?: number;
    totalPages?: number;
    totalResult?: number;
}

export interface VehicleService {
    save: (vehicle: Vehicle, token: string | null) => Promise<VehicleSaveResponse>;
    filter: (filter: VehicleFilter, token?: string | null) => Promise<VehicleFilter>;
    fetch: (id: string) => Promise<VehicleResult>;
    updateStatus: (newStatus: string, vehicleId: number) => Promise<VehicleSaveResponse>;

}

export class VehicleFilter implements IVehicleFilter {
    constructor(
        public search: string = "",
        public own: boolean = false,
        public make: string = "",
        public model: string = "",
        public year: string = "",
        public engineDisplacement: string = "",
        public seater: number = 0,
        public result: VehicleResult[] = [] as VehicleResult[],
        public pageNumber: number = 0,
        public pageSize: number = 10,
        public totalPages: number = 0,
        public totalResult: number = 0
    ) { }
}

export class VehicleService extends BaseService implements VehicleService {

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

    public filter = async (filter: VehicleFilter, token?: string | null): Promise<VehicleFilter> => {
        try {

            const URL = `${this.getBaseURL()}${process.env.VEHICLE_FILTER}`;
            const axiosConfig: AxiosRequestConfig = {
                method: 'POST',
                headers: this.getHeaders(token),
                data: { ...filter }
            }
            const response = await this.doRequest<VehicleFilter>(URL, axiosConfig);

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
import { AxiosRequestConfig } from 'axios';
import { BaseService } from './baseService';
import { VehicleResult } from '../stores/vehicleFilteringStore';

export interface IVehicle {
    plateNumber: string
    make: string
    model: string
    year: string
    engineDisplacement: string
    seater: number
    description: string
    owner: string
    latitude: number
    longitude: number
    title: string,
    ownerId: number,
    price: number,
    pictures: string[]
}

export class Vehicle implements IVehicle {
    constructor(
        public plateNumber: string = "",
        public make: string = "",
        public model: string = "",
        public year: string = "",
        public engineDisplacement: string = "",
        public seater: number = 0,
        public description: string = "",
        public owner: string = "",
        public latitude: number = 0,
        public longitude: number = 0,
        public title: string = "",
        public ownerId: number = 0,
        public price: number = 0.00,
        public pictures: string[] = []
    ) {

    }
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
    ownerId: number;
}

export interface VehicleService {
    save: (data: FormData, token: string | null) => Promise<VehicleSaveResponse>;
    filter: (filter: VehicleFilter, token?: string | null) => Promise<VehicleFilter>;
    fetch: (id: string) => Promise<Vehicle>;
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
        public totalResult: number = 0,
        public ownerId: number = 0
    ) { }

    static withOwnerId(ownerId: number): VehicleFilter {
        return new VehicleFilter("", false, "", "", "", "", 0, [], 0, 10, 0, 0, ownerId);
    }
}

export class VehicleService extends BaseService implements VehicleService {

    public save = async (data: FormData, token: string | null): Promise<VehicleSaveResponse> => {
        try {
            const URL = `${this.getBaseURL()}${process.env.VEHICLE_SAVE}`;
            const axiosConfig: AxiosRequestConfig = {
                method: 'POST',
                headers: { ...this.getHeaders(token), 'Content-Type': 'multipart/form-data' },
                data: data
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

    public fetch = async (id: string): Promise<Vehicle> => {
        try {
            const URL = `${this.getBaseURL()}${process.env.VEHICLE_FILTER}${id}`;
            const axiosConfig: AxiosRequestConfig = {
                method: 'GET',
                headers: this.getHeaders()
            }
            const response = await this.doRequest<Vehicle>(URL, axiosConfig);

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
import axios from 'axios';

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

export const saveVehicle = async (vehicle: Vehicle): Promise<Vehicle> => {
    try {
        const URL = process.env.BASE_URI + process.env.VEHICLE_SAVE_API;

        const response = await axios.post<Vehicle>(URL, vehicle, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('error:', error);
        throw error;
    }
};
import { BaseService } from "./baseService";


export interface GeolocationService {
    getUserLocation: () => Promise<GeolocationCoordinates>;
}

export class GeolocationServiceImpl extends BaseService implements GeolocationService {

    public getUserLocation = async (): Promise<GeolocationCoordinates> => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve(position.coords);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }
}
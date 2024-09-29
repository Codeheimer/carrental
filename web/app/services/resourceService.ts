import { headers } from "next/headers";
import { BaseService } from "./baseService";

export interface ResourceService {
    fetchImage: (token: string, imageUrl: string) => Promise<Blob>
}

export class ResourceServiceImpl extends BaseService implements ResourceService {
    public fetchImage = async (token: string, imageUrl: string): Promise<Blob> => {
        const URL = `${this.getBaseURL()}/api/image/download?filePath=${imageUrl}`;
        const response = await this.doRequest<Blob>(URL, {
            method: 'GET',
            headers: this.getHeaders(token),
            responseType:'blob'
        });
        return response;
    }
}
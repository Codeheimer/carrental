import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export abstract class BaseService {
    protected getBaseURL(): string {
        return process.env.BASE_URI as string;
    };
    
    protected async doRequest<T>(url: string, config: AxiosRequestConfig): Promise<T> {
        console.log(`calling ${url} with confing ${JSON.stringify(config)}`)
        try {
            const response: AxiosResponse<T> = await axios({ url, ...config });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error);
                throw new Error(`Error making request: ${error.response?.status}`);
            } else {
                throw new Error(`Unknown error occurred`);
            }
        }
    }

    protected getHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json'
        }
    }
}
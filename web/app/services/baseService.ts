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

    public getHeaders(token: string | null = null): Record<string, string> {
        let headers = {};
        if (token) {
            headers = this.addHeader(headers, 'Authorization', `Bearer ${token}`);
        }
        headers = this.addHeader(headers, 'Content-Type', 'application/json');
        console.log("Headers", headers);
        return headers;
    }

    private addHeader(headers: Record<string, string>, key: string, value: string): Record<string, string> {
        return { ...headers, [key]: value }
    }
}
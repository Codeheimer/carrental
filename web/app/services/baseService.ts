import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface Header {
    name: string,
    value: string
}

export abstract class BaseService {
    protected getBaseURL(): string {
        return process.env.BASE_URI as string;
    };

    protected async doRequest<T>(url: string, config: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios({ url, ...config });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Unknown error occurred';
                throw new Error(message);
            } else {
                throw new Error(`Unknown error occurred`);
            }
        }
    }

    public getHeaders(token: string | null = null, ...ownHeaders: Header[]): Record<string, string> {
        let headers = {};
        if (token) {
            headers = this.addHeader(headers, 'Authorization', `Bearer ${token}`);
        }
        headers = this.addHeader(headers, 'Content-Type', 'application/json');

        if (ownHeaders && ownHeaders.length > 0) {
            //console.log(`adding own headers ${JSON.stringify(ownHeaders)}`)
            ownHeaders.forEach(h => (headers = this.addHeader(headers, h.name, h.value)))
        }
        //console.log("Headers", headers);
        return headers;
    }

    private addHeader(headers: Record<string, string>, key: string, value: string): Record<string, string> {
        //console.log(`${key}:${value}`)
        return { ...headers, [key]: value }
    }
}
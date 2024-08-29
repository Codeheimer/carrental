import { BaseService } from './baseService';

const TOKEN_KEY = "USER_TOKEN";

interface TokenResponse {
    isValid: boolean
}

export interface AuthenticationService {
    saveToken: (token: string) => void;
    clearToken: () => void;
    isAuthenticated: () => Promise<boolean>;
    verifyToken: (token: string) => Promise<boolean>;
}

export class AuthenticationServiceImpl extends BaseService implements AuthenticationService {
    private VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    public saveToken = (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    }

    public clearToken = (): void => {
        localStorage.removeItem(TOKEN_KEY);
    }

    public isAuthenticated = (): Promise<boolean> => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            return Promise.resolve(false);
        }
        return this.verifyToken(token);
    }

    public verifyToken = async (token: string): Promise<boolean> => {
        const URL = `${this.getBaseURL()}${this.VERIFY_TOKEN}`;

        const response = await this.doRequest<TokenResponse>(URL, {
            method: 'POST',
            headers: this.getHeaders(),
            data: { token }

        });

        return response.isValid;
    }
}
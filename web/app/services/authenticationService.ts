import { BaseService } from './baseService';

const TOKEN_KEY = "USER_TOKEN";

interface TokenResponse {
    isValid: boolean,
    admin: boolean,
    id: string
}

export interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean;
}

export interface AuthenticationResponse {
    id: string,
    token: string,
    message: string,
    admin: boolean
}

export const defaultLoginCredentials = {
    email: "",
    password: "",
    rememberMe: false
}

export interface AuthenticationService {
    saveToken: (token: string) => void;
    clearToken: () => void;
    getToken: () => string | null;
    isAuthenticated: () => Promise<TokenResponse>;
    verifyToken: () => Promise<TokenResponse>;
    getHeaders: () => Record<string, string>;
    generateToken: (credentials: LoginCredentials) => Promise<AuthenticationResponse>;
}

export class AuthenticationServiceImpl extends BaseService implements AuthenticationService {
    private VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    private GENERATE_TOKEN = process.env.GENERATE_TOKEN;

    public saveToken = (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    }

    public clearToken = (): void => {
        localStorage.removeItem(TOKEN_KEY);
    }

    public getToken = (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    }

    public isAuthenticated = (): Promise<TokenResponse> => {
        const token = localStorage.getItem(TOKEN_KEY);
        console.log("TOKEN IN MSTORAGE", token)
        if (!token) {
            return Promise.resolve({ isValid: false, admin: false,id:"" });
        }
        return this.verifyToken();
    }

    public verifyToken = async (): Promise<TokenResponse> => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            return { isValid: false, admin: false,id:"" }
        }
        const URL = `${this.getBaseURL()}${this.VERIFY_TOKEN}`;

        const response = await this.doRequest<TokenResponse>(URL, {
            method: 'POST',
            headers: this.getHeaders(),
            data: { token }

        });

        return response;
    }

    public generateToken = async (credentials: LoginCredentials): Promise<AuthenticationResponse> => {
        const URL = `${this.getBaseURL()}${this.GENERATE_TOKEN}`;
        const response = await this.doRequest<AuthenticationResponse>(URL, {
            method: 'POST',
            headers: this.getHeaders(),
            data: { ...credentials }

        });

        return response;
    }
}
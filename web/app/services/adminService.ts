import { BaseService } from "./baseService"

interface FetchUsersResponse {
    success: boolean,
    message: string,
    users: User[]
}

export interface User {
    id: string,
    name: string,
    uploadedId: string,
    uploadedBusinessPermit: string,
    profilePicture: string,
    status: string,
    deactivated: boolean
}

export interface AdminService {
    fetchUsers: (token: string) => Promise<FetchUsersResponse>,
    updateStatus: (token: string, id: string, status: string) => Promise<void>,
    toggleDeactivate: (token: string, id: string) => Promise<void>,
    changePassword: (token: string, id: string, newPassword: string) => Promise<void>,
    uploadAddressJson: (token: string, form: FormData) => Promise<void>
}

export class AdminServiceImpl extends BaseService implements AdminService {
    private FETCH_USERS = process.env.FETCH_USERS;

    public fetchUsers = async (token: string): Promise<FetchUsersResponse> => {
        const URL = `${this.getBaseURL()}${this.FETCH_USERS}`;

        const response = await this.doRequest<FetchUsersResponse>(URL,
            {
                method: 'GET',
                headers: this.getHeaders(token)
            });

        return response;
    }

    public updateStatus = async (token: string, id: string, status: string): Promise<void> => {
        const URL = `${this.getBaseURL()}/admin/user/${id}/status/${status}`;

        this.doRequest<void>(URL, {
            method: 'PUT',
            headers: this.getHeaders(token)
        });

        return Promise.resolve();
    }

    public toggleDeactivate = (token: string, id: string): Promise<void> => {
        const URL = `${this.getBaseURL()}/admin/user/${id}/toggleDeactivate`;

        this.doRequest<void>(URL, {
            method: 'PUT',
            headers: this.getHeaders(token)
        });

        return Promise.resolve();
    }

    public changePassword = (token: string, id: string, newPassword: string): Promise<void> => {
        const URL = `${this.getBaseURL()}/admin/user/${id}/changePass`;
        this.doRequest<void>(URL, {
            method: 'PUT',
            headers: this.getHeaders(token),
            data: { newPassword: newPassword }
        });
        return Promise.resolve();
    }

    public uploadAddressJson = (token: string, form: FormData): Promise<void> => {
        const URL = `${this.getBaseURL()}${process.env.UTIL_ADDRESS_JSON_UPLOAD}`;
        this.doRequest<void>(URL, {
            method: 'POST',
            headers: this.getHeaders(token, { name: 'Content-Type', value: 'multipart/form-data' }),
            data: form
        });
        return Promise.resolve();
    }
}
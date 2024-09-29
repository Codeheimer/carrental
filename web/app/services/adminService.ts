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
    status: string
}

export interface AdminService {
    fetchUsers: (token: string) => Promise<FetchUsersResponse>,
    updateStatus: (token: string, id: string, status: string) => Promise<void>
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
}
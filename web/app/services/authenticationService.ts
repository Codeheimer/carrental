import axios from 'axios';

const TOKEN_KEY = "USER_TOKEN"

interface Token {
    token : string
}

export const isAuthenticated = (): boolean => {
    let isTokenValid = false;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        return isTokenValid;
    }
    verifyToken(token).then(result => {
        isTokenValid = result;
    }).catch(error => {
        console.error('Token verification failed:', error);
        isTokenValid = false;
    });
    return isTokenValid;
}

export const saveToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
}

export const clearToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
}

export const verifyToken = async (token: string): Promise<boolean> => {
    let isTokenValid = false;
    try {
        const URL = process.env.BASE_URI + process.env.VERIFY_TOKEN;

        const response = await axios.post<boolean>(URL, { "token" : token}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        isTokenValid = response.data;
    } catch (error) {
        console.error('error:', error);
        throw error;
    }
    return isTokenValid;
}
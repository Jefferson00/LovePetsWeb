import axios from 'axios';
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
    const { '@LovePetsBeta:token': token } = parseCookies(ctx)

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/'
    });

    if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
    }

    return api;
}

export const api = getAPIClient();
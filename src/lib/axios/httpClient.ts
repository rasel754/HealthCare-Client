import { ApiErrorResponse, ApiResponse } from '@/src/types/api.types';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined")
}
const axiosInstance = () => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 3000,
        headers: {
            'Content-Type': "application/json"
        }
    })
    return instance;
}


export interface apiRequestOptions {
    params?: Record<string, unknown>
    headers?: Record<string, string>
}

const httpGet = async <TData>(endpoint: string, options?: apiRequestOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers
        })

        return response.data

    } catch (error) {
        console.error(`Error in GET request to ${endpoint}: `,error);

       throw error
    }
}

const httpPost = async <TData>(endpoint: string, data:unknown , options?: apiRequestOptions ):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers
        })

        return response.data

    } catch (error) {
        console.error(`Error in POST request to ${endpoint}: `,error);

       throw error
    }
}

const httpPut = async <TData> (endpoint: string, data: unknown, options?: apiRequestOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers
        })

        return response.data

    } catch (error) {
        console.error(`Error in PUT request to ${endpoint}: `,error);

       throw error
    }
}

const httpPatch = async <TData>(endpoint: string, data:unknown, options?: apiRequestOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers
        })

        return response.data

    } catch (error) {
        console.error(`Error in PATCH request to ${endpoint}: `,error);

       throw error
    }
}

const httpDelete = async <TData> (endpoint: string, options?: apiRequestOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = axiosInstance();
        const response = await instance.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers
        })

        return response.data

    } catch (error) {
        console.error(`Error in DELETE request to ${endpoint}: `,error);

       throw error
    }
}

export const httpClient= {
    get: httpGet,
    post:httpPost,
    put:httpPut,
    patch:httpPatch,
    delete:httpDelete
}
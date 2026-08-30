import { ApiErrorResponse, ApiResponse } from '@/src/types/api.types';
import axios, { AxiosRequestConfig } from 'axios';
import { getCookie } from '../cookieUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = async () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (typeof window === 'undefined') {
        try {
            const token = await getCookie('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch {
            // Ignore error when cookies() is not available
        }
    }

    return headers;
};

const createInstance = async (customHeaders?: Record<string, string>) => {
    const defaultHeaders = await getAuthHeaders();
    return axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        withCredentials: true,
        headers: {
            ...defaultHeaders,
            ...customHeaders,
        },
    });
};

export interface apiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

const httpGet = async <TData>(endpoint: string, options?: apiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await createInstance(options?.headers);
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error in GET request to ${endpoint}: `, error?.response?.data || error.message);
        throw error?.response?.data || { success: false, message: error.message };
    }
};

const httpPost = async <TData>(endpoint: string, data?: unknown, options?: apiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await createInstance(options?.headers);
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error in POST request to ${endpoint}: `, error?.response?.data || error.message);
        throw error?.response?.data || { success: false, message: error.message };
    }
};

const httpPut = async <TData>(endpoint: string, data?: unknown, options?: apiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await createInstance(options?.headers);
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error in PUT request to ${endpoint}: `, error?.response?.data || error.message);
        throw error?.response?.data || { success: false, message: error.message };
    }
};

const httpPatch = async <TData>(endpoint: string, data?: unknown, options?: apiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await createInstance(options?.headers);
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error in PATCH request to ${endpoint}: `, error?.response?.data || error.message);
        throw error?.response?.data || { success: false, message: error.message };
    }
};

const httpDelete = async <TData>(endpoint: string, options?: apiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await createInstance(options?.headers);
        const response = await instance.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error in DELETE request to ${endpoint}: `, error?.response?.data || error.message);
        throw error?.response?.data || { success: false, message: error.message };
    }
};

const httpPostForm = async <TData>(endpoint: string, formData: FormData, options?: apiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await createInstance({
            'Content-Type': 'multipart/form-data',
            ...options?.headers,
        });
        const response = await instance.post<ApiResponse<TData>>(endpoint, formData, {
            params: options?.params,
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error in POST Form request to ${endpoint}: `, error?.response?.data || error.message);
        throw error?.response?.data || { success: false, message: error.message };
    }
};

const httpPatchForm = async <TData>(endpoint: string, formData: FormData, options?: apiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await createInstance({
            'Content-Type': 'multipart/form-data',
            ...options?.headers,
        });
        const response = await instance.patch<ApiResponse<TData>>(endpoint, formData, {
            params: options?.params,
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error in PATCH Form request to ${endpoint}: `, error?.response?.data || error.message);
        throw error?.response?.data || { success: false, message: error.message };
    }
};

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
    postForm: httpPostForm,
    patchForm: httpPatchForm,
};
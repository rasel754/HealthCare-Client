
import axios from 'axios';
import { cookies, headers } from 'next/headers';
import { isTokenExpiringSoon } from '../tokenUtils';
import { getNewTokensWithRefreshToken } from '@/src/services/auth.services';
import { ApiResponse } from '@/src/types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables');
}

async function tryRefreshToken(
    accessToken: string,
    refreshToken: string
): Promise<void>
{
    if(!isTokenExpiringSoon(accessToken)) {
        return;
    }

    try {
        const requestHeader = await headers();

        if (requestHeader.get("x-token-refreshed") === "1") {
            return; // avoid multiple refresh attempts in the same request lifecycle
        }
    } catch {
        // ignore when headers() is unavailable during build
    }

    try {
        await getNewTokensWithRefreshToken(refreshToken);
    } catch (error : any) {
        console.error("Error refreshing token in http client:", error);
    }
}

const axiosInstance = async () => {
    let cookieHeader = "";
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if(accessToken && refreshToken){
            await tryRefreshToken(accessToken, refreshToken);
        }

        cookieHeader = cookieStore
                                    .getAll()
                                    .map((cookie) => `${cookie.name}=${cookie.value}`)
                                    .join("; ");    
    } catch {
        // ignore when cookies() is unavailable during SSG build
    }

    const instance = axios.create({
        baseURL : API_BASE_URL,
        timeout : 30000,
        headers:{
            'Content-Type' : 'application/json',
            Cookie : cookieHeader
        }
    })

    return instance;
}

export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

const logHttpError = (method: string, endpoint: string, error: any) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`${method} request to ${endpoint} failed (${status || 'No Response'}): ${message}`);
    } else {
        console.error(`${method} request to ${endpoint} failed:`, error?.message || error);
    }
};

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {     
        const instance = await axiosInstance();   
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {       
        logHttpError('GET', endpoint, error);
        throw error;
    }
}

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        logHttpError('POST', endpoint, error);
        throw error;
    }
}

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        logHttpError('PUT', endpoint, error);
        throw error;
    }
}

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    }
    catch (error) {
        logHttpError('PATCH', endpoint, error);
        throw error;
    }
}

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.delete<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    logHttpError('DELETE', endpoint, error);
    throw error;
  }
};

const httpPostForm = async <TData>(endpoint: string, data: FormData, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: {
        ...options?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    logHttpError('POST Form', endpoint, error);
    throw error;
  }
};

const httpPatchForm = async <TData>(endpoint: string, data: FormData, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: {
        ...options?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    logHttpError('PATCH Form', endpoint, error);
    throw error;
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
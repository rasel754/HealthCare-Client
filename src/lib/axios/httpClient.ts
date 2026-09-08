
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
    refreshToken: string,
    sessionToken?: string
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
        await getNewTokensWithRefreshToken(refreshToken, sessionToken);
    } catch (error : any) {
        console.error("Error refreshing token in http client:", error);
    }
}

export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    skipAuth?: boolean;
}

const axiosInstance = async (options?: ApiRequestOptions) => {
    let cookieHeader = "";
    let accessTokenValue = "";
    let sessionTokenValue = "";
    
    if (!options?.skipAuth) {
        try {
            const cookieStore = await cookies();
            const accessToken = cookieStore.get("accessToken")?.value;
            const refreshToken = cookieStore.get("refreshToken")?.value;
            const sessionToken =
                cookieStore.get("better-auth.session_token")?.value ||
                cookieStore.get("better-auth-session")?.value ||
                cookieStore.get("better-auth-session-token")?.value;

            accessTokenValue = accessToken || "";
            sessionTokenValue = sessionToken || "";

            if (accessToken && refreshToken) {
                await tryRefreshToken(accessToken, refreshToken, sessionToken);
            } else if (!accessToken && refreshToken) {
                try {
                    await getNewTokensWithRefreshToken(refreshToken, sessionToken);
                } catch (err) {
                    console.error("Failed to get new tokens with refresh token:", err);
                }
            }

            const cookieList = cookieStore.getAll();
            cookieHeader = cookieList
                .map((cookie) => `${cookie.name}=${cookie.value}`)
                .join("; ");
            
            // Ensure better-auth session cookie is present in cookieHeader if sessionToken exists
            if (sessionTokenValue && !cookieHeader.includes("better-auth.session_token")) {
                cookieHeader = cookieHeader ? `${cookieHeader}; better-auth.session_token=${sessionTokenValue}` : `better-auth.session_token=${sessionTokenValue}`;
            }
        } catch {
            // ignore when cookies() is unavailable during SSG build
        }
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...options?.headers,
    };

    if (accessTokenValue && !options?.skipAuth && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${accessTokenValue}`;
    }

    if (sessionTokenValue && !options?.skipAuth && !headers['x-session-token']) {
        headers['x-session-token'] = sessionTokenValue;
    }

    const instance = axios.create({
        baseURL : API_BASE_URL,
        timeout : 30000,
        headers,
    });

    return instance;
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
        const instance = await axiosInstance(options);   
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
        const instance = await axiosInstance(options);
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
        const instance = await axiosInstance(options);
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
        const instance = await axiosInstance(options);
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
    const instance = await axiosInstance(options);
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
    const instance = await axiosInstance(options);
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
    const instance = await axiosInstance(options);
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
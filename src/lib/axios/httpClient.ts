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

const httpGet = async (endpoint: string, options?: apiRequestOptions) => {
    try {
        const response = await axiosInstance().get(endpoint, {
            params: options?.params,
            headers: options?.headers
        })

        return response.data

    } catch (error) {
        console.error(`Error in GET request to ${endpoint}: `,error);

       throw error
    }
}

const httpPost = async (endpoint: string, data:unknown , options?: apiRequestOptions ) => {
    try {
        const response = await axiosInstance().post(endpoint, data, {
            params: options?.params,
            headers: options?.headers
        })

        return response.data

    } catch (error) {
        console.error(`Error in POST request to ${endpoint}: `,error);

       throw error
    }
}

const httpPut = async (endpoint: string, data: unknown, options?: apiRequestOptions) => {
    try {
        const response = await axiosInstance().put(endpoint, data, {
            params: options?.params,
            headers: options?.headers
        })

        return response.data

    } catch (error) {
        console.error(`Error in PUT request to ${endpoint}: `,error);

       throw error
    }
}

const httpPatch = async (endpoint: string, data:unknown, options?: apiRequestOptions) => {
    try {
        const response = await axiosInstance().patch(endpoint, data, {
            params: options?.params,
            headers: options?.headers
        })

        return response.data

    } catch (error) {
        console.error(`Error in PATCH request to ${endpoint}: `,error);

       throw error
    }
}

const httpDelete = async (endpoint: string, options?: apiRequestOptions) => {
    try {
        const response = await axiosInstance().delete(endpoint, {
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
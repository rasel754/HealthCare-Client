"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { deleteCookie, setCookie } from "@/src/lib/cookieUtils";
import { setTokenInCookies } from "@/src/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/src/types/api.types";
import { ILoginResponse, IRegisterResponse, IUser } from "@/src/types/auth.type";
import {
  IChangePasswordPayload,
  IForgetPasswordPayload,
  ILoginPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  IVerifyEmailPayload,
} from "@/src/zod/auth.validation";
import { cookies } from "next/headers";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!BASE_API_URL){
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const loginService = async (payload: ILoginPayload): Promise<ILoginResponse | ApiErrorResponse> => {
  try {
    const response = await httpClient.post<ILoginResponse>("/auth/login", payload);
    if (response?.data) {
      const { accessToken, refreshToken, token } = response.data;
      if (accessToken) await setTokenInCookies("accessToken", accessToken);
      if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
      if (token) await setCookie("better-auth.session_token", token, 24 * 60 * 60);
      return response.data;
    }
    return { success: false, message: response.message || "Login failed" };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.errorMessage ||
      error?.response?.data?.errorSources?.[0]?.message ||
      error?.message ||
      "Login failed";
    return { success: false, message, error: error?.response?.data };
  }
};

export const registerPatientService = async (payload: IRegisterPayload): Promise<ApiResponse<IRegisterResponse> | ApiErrorResponse> => {
  try {
    return await httpClient.post<IRegisterResponse>("/auth/register", payload);
  } catch (error: any) {
    if (error?.code === "ECONNREFUSED") {
      return { success: false, message: "Unable to connect to backend server. Please make sure the server is running on port 5000." };
    }
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.errorMessage ||
      error?.response?.data?.errorSources?.[0]?.message ||
      error?.message ||
      "Registration failed";
    return { success: false, message, error: error?.response?.data };
  }
};

export const getMeService = async (): Promise<ApiResponse<IUser> | ApiErrorResponse> => {
  try {
    let accessToken: string | undefined;
    let sessionToken: string | undefined;
    try {
      const cookieStore = await cookies();
      accessToken = cookieStore.get("accessToken")?.value;
      sessionToken = cookieStore.get("better-auth.session_token")?.value;
    } catch {
      // cookies unavailable during build
    }
    if (!accessToken && !sessionToken) {
      return { success: false, message: "Unauthenticated" };
    }
    return await httpClient.get<IUser>("/auth/me");
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch user details" };
  }
};

export const logoutService = async (): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    const response = await httpClient.post<null>("/auth/logout", {});
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");
    return response;
  } catch (error: any) {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");
    return { success: true, message: "Logged out" };
  }
};

export const verifyEmailService = async (payload: IVerifyEmailPayload): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.post<null>("/auth/verify-email", payload);
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Email verification failed";
    return { success: false, message, error: error?.response?.data };
  }
};

export const forgetPasswordService = async (payload: IForgetPasswordPayload): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.post<null>("/auth/forget-password", payload);
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Forget password request failed";
    return { success: false, message, error: error?.response?.data };
  }
};

export const resetPasswordService = async (payload: IResetPasswordPayload): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.post<null>("/auth/reset-password", payload);
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Password reset failed";
    return { success: false, message, error: error?.response?.data };
  }
};

export const changePasswordService = async (payload: IChangePasswordPayload): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.post<null>("/auth/change-password", payload);
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Change password failed";
    return { success: false, message, error: error?.response?.data };
  }
};

export async function getNewTokensWithRefreshToken(refreshToken  : string) : Promise<boolean> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Cookie : `refreshToken=${refreshToken}`
            }
        });

        if(!res.ok){
            return false;
        }

        const {data} = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if(accessToken){
            await setTokenInCookies("accessToken", accessToken);
        }

        if(newRefreshToken){
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if(token){
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        }

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export async function getUserInfo() {
    try {
        let accessToken: string | undefined;
        try {
            const cookieStore = await cookies();
            accessToken = cookieStore.get("accessToken")?.value;
        } catch {
            return null;
        }

        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch user info:", res.status, res.statusText);
            return null;
        }

        const { data } = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}
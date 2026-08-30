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
    return { success: false, message: error?.message || "Login failed" };
  }
};

export const registerPatientService = async (payload: IRegisterPayload): Promise<ApiResponse<IRegisterResponse> | ApiErrorResponse> => {
  try {
    return await httpClient.post<IRegisterResponse>("/auth/register", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Registration failed" };
  }
};

export const getMeService = async (): Promise<ApiResponse<IUser> | ApiErrorResponse> => {
  try {
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
    return { success: false, message: error?.message || "Email verification failed" };
  }
};

export const forgetPasswordService = async (payload: IForgetPasswordPayload): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.post<null>("/auth/forget-password", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Forget password request failed" };
  }
};

export const resetPasswordService = async (payload: IResetPasswordPayload): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.post<null>("/auth/reset-password", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Password reset failed" };
  }
};

export const changePasswordService = async (payload: IChangePasswordPayload): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.post<null>("/auth/change-password", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Change password failed" };
  }
};
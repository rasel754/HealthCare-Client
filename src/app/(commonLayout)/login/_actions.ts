"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/src/lib/authUtils";
import { httpClient } from "@/src/lib/axios/httpClient";
import { setTokenInCookies } from "@/src/lib/tokenUtils";
import { ApiErrorResponse } from "@/src/types/api.types";
import { ILoginResponse } from "@/src/types/auth.type";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";
import { redirect } from "next/navigation";

export interface ILoginActionResult {
    success: boolean;
    message: string;
    data?: ILoginResponse;
    targetPath?: string;
    needEmailVerify?: boolean;
    email?: string;
}

export const loginAction = async (payload : ILoginPayload, redirectPath ?: string ) : Promise<ILoginActionResult> =>{
    const parsedPayload = loginZodSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {
        const response = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data, { skipAuth: true });

        const { accessToken, refreshToken, token, user } = response.data;
        const { role, needPasswordChange, email } = user;
        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds

        let targetPath = redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
            ? redirectPath
            : getDefaultDashboardRoute(role as UserRole);

        if (needPasswordChange) {
            targetPath = `/reset-password?email=${encodeURIComponent(email)}`;
        }

        return {
            success: true,
            message: "Login successful",
            data: response.data,
            targetPath,
        };
        
    } catch (error : any) {
        if(error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")){
            throw error;
        }

        if (error && error.response && error.response.data?.message === "Email not verified") {
            return {
                success: false,
                needEmailVerify: true,
                email: payload.email,
                message: "Email not verified",
            };
        }

        if (error?.code === "ECONNREFUSED") {
            return {
                success: false,
                message: "Unable to connect to backend server. Please make sure the server is running on port 5000.",
            };
        }

        const serverErrorMessage = error?.response?.data?.message || error?.message || "Login failed";
        return {
            success: false,
            message: serverErrorMessage,
        };
    }
}
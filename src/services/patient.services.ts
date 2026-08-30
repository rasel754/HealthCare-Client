"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/src/types/api.types";
import { IPatient } from "@/src/types/domain.types";

export const updateMyProfileService = async (formData: FormData): Promise<ApiResponse<IPatient> | ApiErrorResponse> => {
  try {
    return await httpClient.patchForm<IPatient>("/patient/update-my-profile", formData);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update profile" };
  }
};

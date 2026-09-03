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

export const getPatientsService = async (params?: Record<string, unknown>): Promise<ApiResponse<IPatient[]> | ApiErrorResponse> => {
  try {
    return await httpClient.get<IPatient[]>("/patient", { params });
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch patients" };
  }
};

export const getPatientByIdService = async (id: string): Promise<ApiResponse<IPatient> | ApiErrorResponse> => {
  try {
    return await httpClient.get<IPatient>(`/patient/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch patient details" };
  }
};

export const updatePatientService = async (id: string, payload: Partial<IPatient>): Promise<ApiResponse<IPatient> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<IPatient>(`/patient/${id}`, payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update patient" };
  }
};

export const deletePatientService = async (id: string): Promise<ApiResponse<IPatient> | ApiErrorResponse> => {
  try {
    return await httpClient.delete<IPatient>(`/patient/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete patient" };
  }
};

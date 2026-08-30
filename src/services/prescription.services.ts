"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse, IQueryParams } from "@/src/types/api.types";
import { IPrescription } from "@/src/types/domain.types";
import { ICreatePrescriptionPayload, IUpdatePrescriptionPayload } from "@/src/zod/prescription.validation";

export const getAllPrescriptionsService = async (params?: IQueryParams): Promise<ApiResponse<IPrescription[]>> => {
  return await httpClient.get<IPrescription[]>("/prescription", { params });
};

export const getMyPrescriptionsService = async (params?: IQueryParams): Promise<ApiResponse<IPrescription[]>> => {
  return await httpClient.get<IPrescription[]>("/prescription/my-prescriptions", { params });
};

export const createPrescriptionService = async (payload: ICreatePrescriptionPayload): Promise<ApiResponse<IPrescription> | ApiErrorResponse> => {
  try {
    return await httpClient.post<IPrescription>("/prescription", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to issue prescription" };
  }
};

export const updatePrescriptionService = async (id: string, payload: IUpdatePrescriptionPayload): Promise<ApiResponse<IPrescription> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<IPrescription>(`/prescription/${id}`, payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update prescription" };
  }
};

export const deletePrescriptionService = async (id: string): Promise<ApiResponse<IPrescription> | ApiErrorResponse> => {
  try {
    return await httpClient.delete<IPrescription>(`/prescription/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete prescription" };
  }
};

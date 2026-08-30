"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse, IQueryParams } from "@/src/types/api.types";
import { IDoctor } from "@/src/types/domain.types";
import { ICreateDoctorPayload, IUpdateDoctorPayload } from "@/src/zod/doctor.validation";

export const getDoctorsService = async (params?: IQueryParams): Promise<ApiResponse<IDoctor[]>> => {
  return await httpClient.get<IDoctor[]>("/doctors", { params });
};

export const getDoctorByIdService = async (id: string): Promise<ApiResponse<IDoctor>> => {
  return await httpClient.get<IDoctor>(`/doctors/${id}`);
};

export const createDoctorService = async (payload: ICreateDoctorPayload): Promise<ApiResponse<IDoctor> | ApiErrorResponse> => {
  try {
    return await httpClient.post<IDoctor>("/users/create-doctor", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create doctor account" };
  }
};

export const updateDoctorService = async (id: string, payload: IUpdateDoctorPayload): Promise<ApiResponse<IDoctor> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<IDoctor>(`/doctors/${id}`, payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update doctor" };
  }
};

export const deleteDoctorService = async (id: string): Promise<ApiResponse<IDoctor> | ApiErrorResponse> => {
  try {
    return await httpClient.delete<IDoctor>(`/doctors/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete doctor" };
  }
};

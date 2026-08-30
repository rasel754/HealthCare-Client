"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/src/types/api.types";
import { ISpecialty } from "@/src/types/domain.types";

export const getSpecialtiesService = async (): Promise<ApiResponse<ISpecialty[]>> => {
  return await httpClient.get<ISpecialty[]>("/specialty");
};

export const createSpecialtyService = async (formData: FormData): Promise<ApiResponse<ISpecialty> | ApiErrorResponse> => {
  try {
    return await httpClient.postForm<ISpecialty>("/specialty", formData);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create specialty" };
  }
};

export const updateSpecialtyService = async (id: string, formData: FormData): Promise<ApiResponse<ISpecialty> | ApiErrorResponse> => {
  try {
    return await httpClient.patchForm<ISpecialty>(`/specialty/${id}`, formData);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update specialty" };
  }
};

export const deleteSpecialtyService = async (id: string): Promise<ApiResponse<ISpecialty> | ApiErrorResponse> => {
  try {
    return await httpClient.delete<ISpecialty>(`/specialty/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete specialty" };
  }
};

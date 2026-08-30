"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse, IQueryParams } from "@/src/types/api.types";
import { IDoctorSchedule, ISchedule } from "@/src/types/domain.types";
import {
  IAssignDoctorSchedulePayload,
  ICreateSchedulePayload,
  IUpdateDoctorSchedulePayload,
} from "@/src/zod/schedule.validation";

export const createSchedulesService = async (payload: ICreateSchedulePayload): Promise<ApiResponse<ISchedule[]> | ApiErrorResponse> => {
  try {
    return await httpClient.post<ISchedule[]>("/schedules", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create schedules" };
  }
};

export const getSchedulesService = async (params?: IQueryParams): Promise<ApiResponse<ISchedule[]>> => {
  return await httpClient.get<ISchedule[]>("/schedules", { params });
};

export const getScheduleByIdService = async (id: string): Promise<ApiResponse<ISchedule>> => {
  return await httpClient.get<ISchedule>(`/schedules/${id}`);
};

export const updateScheduleService = async (id: string, payload: Partial<ICreateSchedulePayload>): Promise<ApiResponse<ISchedule> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<ISchedule>(`/schedules/${id}`, payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update schedule slot" };
  }
};

export const deleteScheduleService = async (id: string): Promise<ApiResponse<ISchedule> | ApiErrorResponse> => {
  try {
    return await httpClient.delete<ISchedule>(`/schedules/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete schedule slot" };
  }
};

// Doctor Schedule Assignment APIs
export const createMyDoctorScheduleService = async (payload: IAssignDoctorSchedulePayload): Promise<ApiResponse<IDoctorSchedule[]> | ApiErrorResponse> => {
  try {
    return await httpClient.post<IDoctorSchedule[]>("/doctor-schedules/create-my-doctor-schedule", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to assign schedule slots" };
  }
};

export const getMyDoctorSchedulesService = async (params?: IQueryParams): Promise<ApiResponse<IDoctorSchedule[]>> => {
  return await httpClient.get<IDoctorSchedule[]>("/doctor-schedules/my-doctor-schedules", { params });
};

export const getAllDoctorSchedulesService = async (params?: IQueryParams): Promise<ApiResponse<IDoctorSchedule[]>> => {
  return await httpClient.get<IDoctorSchedule[]>("/doctor-schedules", { params });
};

export const updateMyDoctorScheduleService = async (payload: IUpdateDoctorSchedulePayload): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<null>("/doctor-schedules/update-my-doctor-schedule", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update doctor schedule" };
  }
};

export const deleteMyDoctorScheduleService = async (scheduleId: string): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.delete<null>(`/doctor-schedules/delete-my-doctor-schedule/${scheduleId}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete doctor schedule slot" };
  }
};

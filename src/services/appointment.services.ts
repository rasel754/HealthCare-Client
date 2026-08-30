"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse, IQueryParams } from "@/src/types/api.types";
import { AppointmentStatus } from "@/src/types/auth.type";
import { IAppointment, IPayment } from "@/src/types/domain.types";
import { IBookAppointmentPayload } from "@/src/zod/appointment.validation";

export interface IBookAppointmentResponse {
  appointment: IAppointment;
  payment?: IPayment;
  paymentUrl?: string;
}

export const bookAppointmentService = async (payload: IBookAppointmentPayload): Promise<ApiResponse<IBookAppointmentResponse> | ApiErrorResponse> => {
  try {
    return await httpClient.post<IBookAppointmentResponse>("/appointments/book-appointment", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to book appointment" };
  }
};

export const bookAppointmentWithPayLaterService = async (payload: IBookAppointmentPayload): Promise<ApiResponse<IAppointment> | ApiErrorResponse> => {
  try {
    return await httpClient.post<IAppointment>("/appointments/book-appointment-with-pay-later", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to book appointment" };
  }
};

export const initiatePaymentService = async (appointmentId: string): Promise<ApiResponse<{ paymentUrl: string }> | ApiErrorResponse> => {
  try {
    return await httpClient.post<{ paymentUrl: string }>(`/appointments/initiate-payment/${appointmentId}`, {});
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to initiate payment" };
  }
};

export const getMyAppointmentsService = async (params?: IQueryParams): Promise<ApiResponse<IAppointment[]>> => {
  return await httpClient.get<IAppointment[]>("/appointments/my-appointments", { params });
};

export const getMySingleAppointmentService = async (id: string): Promise<ApiResponse<IAppointment>> => {
  return await httpClient.get<IAppointment>(`/appointments/my-single-appointment/${id}`);
};

export const getAllAppointmentsService = async (params?: IQueryParams): Promise<ApiResponse<IAppointment[]>> => {
  return await httpClient.get<IAppointment[]>("/appointments/all-appointments", { params });
};

export const changeAppointmentStatusService = async (id: string, status: AppointmentStatus): Promise<ApiResponse<IAppointment> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<IAppointment>(`/appointments/change-appointment-status/${id}`, { status });
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update appointment status" };
  }
};

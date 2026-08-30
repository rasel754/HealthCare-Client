"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse, IQueryParams } from "@/src/types/api.types";
import { Role, UserStatus } from "@/src/types/auth.type";
import { IAdmin, ISuperAdmin } from "@/src/types/domain.types";

export const createAdminService = async (payload: { password: string; admin: Partial<IAdmin> }): Promise<ApiResponse<IAdmin> | ApiErrorResponse> => {
  try {
    return await httpClient.post<IAdmin>("/users/create-admin", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create admin" };
  }
};

export const createSuperAdminService = async (payload: { password: string; superAdmin: Partial<ISuperAdmin> }): Promise<ApiResponse<ISuperAdmin> | ApiErrorResponse> => {
  try {
    return await httpClient.post<ISuperAdmin>("/users/create-super-admin", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create super admin" };
  }
};

export const getAdminsService = async (params?: IQueryParams): Promise<ApiResponse<IAdmin[]>> => {
  return await httpClient.get<IAdmin[]>("/admins", { params });
};

export const getAdminByIdService = async (id: string): Promise<ApiResponse<IAdmin>> => {
  return await httpClient.get<IAdmin>(`/admins/${id}`);
};

export const updateAdminService = async (id: string, payload: Partial<IAdmin>): Promise<ApiResponse<IAdmin> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<IAdmin>(`/admins/${id}`, payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update admin" };
  }
};

export const deleteAdminService = async (id: string): Promise<ApiResponse<IAdmin> | ApiErrorResponse> => {
  try {
    return await httpClient.delete<IAdmin>(`/admins/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete admin" };
  }
};

export const changeUserStatusService = async (userId: string, userStatus: UserStatus): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<null>("/admins/change-user-status", { userId, userStatus });
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to change user status" };
  }
};

export const changeUserRoleService = async (userId: string, role: Role): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<null>("/admins/change-user-role", { userId, role });
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to change user role" };
  }
};

export const getSuperAdminsService = async (params?: IQueryParams): Promise<ApiResponse<ISuperAdmin[]>> => {
  return await httpClient.get<ISuperAdmin[]>("/super-admins", { params });
};

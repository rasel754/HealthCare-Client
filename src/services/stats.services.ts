"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiResponse } from "@/src/types/api.types";
import { IDashboardStats } from "@/src/types/domain.types";

export const getDashboardStatsService = async (): Promise<ApiResponse<IDashboardStats>> => {
  try {
    return await httpClient.get<IDashboardStats>("/stats");
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to fetch stats",
      data: {} as IDashboardStats,
    };
  }
};

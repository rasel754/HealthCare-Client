"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiResponse } from "@/src/types/api.types";
import { IDashboardStats } from "@/src/types/domain.types";

export const getDashboardStatsService = async (): Promise<ApiResponse<IDashboardStats>> => {
  return await httpClient.get<IDashboardStats>("/stats");
};

"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse, IQueryParams } from "@/src/types/api.types";
import { IReview } from "@/src/types/domain.types";
import { ICreateReviewPayload, IUpdateReviewPayload } from "@/src/zod/review.validation";

export const getAllReviewsService = async (params?: IQueryParams): Promise<ApiResponse<IReview[]>> => {
  return await httpClient.get<IReview[]>("/review", { params });
};

export const getMyReviewsService = async (params?: IQueryParams): Promise<ApiResponse<IReview[]>> => {
  return await httpClient.get<IReview[]>("/review/my-reviews", { params });
};

export const createReviewService = async (payload: ICreateReviewPayload): Promise<ApiResponse<IReview> | ApiErrorResponse> => {
  try {
    return await httpClient.post<IReview>("/review", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to submit review" };
  }
};

export const updateReviewService = async (id: string, payload: IUpdateReviewPayload): Promise<ApiResponse<IReview> | ApiErrorResponse> => {
  try {
    return await httpClient.patch<IReview>(`/review/${id}`, payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update review" };
  }
};

export const deleteReviewService = async (id: string): Promise<ApiResponse<IReview> | ApiErrorResponse> => {
  try {
    return await httpClient.delete<IReview>(`/review/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete review" };
  }
};

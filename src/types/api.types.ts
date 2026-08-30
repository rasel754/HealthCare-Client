export interface ApiResponse<TData = unknown> {
    success: boolean;
    message: string;
    data: TData;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    error?: unknown;
}

export interface IQueryParams {
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    gender?: string;
    specialties?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: unknown;
}
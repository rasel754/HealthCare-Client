import { httpClient } from "../lib/axios/httpClient";

// ======================
// TypeScript Interfaces
// ======================
export interface IQueryRagPayload {
  query: string;
  limit?: number;
  sourceType?: "DOCTOR" | string;
}

export interface IRagDoctorRecommendation {
  name: string;
  specialty: string;
  reason: string;
}

export interface IRagSourceDoc {
  id: string;
  chunkKey?: string;
  sourceType?: string;
  sourceId?: string;
  sourceLevel?: string;
  content: string;
  similarity: number;
}

export interface IRagQueryResponse {
  answer: {
    doctors?: IRagDoctorRecommendation[];
    [key: string]: any;
  } | string;
  sources: IRagSourceDoc[];
  contextUsed: boolean;
}

export interface IRagStatsResponse {
  totalActiveDocuments: number;
  sourceTypeBreakdown: Record<string, number>;
  timestamp: string;
}

export interface IIngestDoctorResponse {
  success: boolean;
  message: string;
  indexCount?: number;
  indexedCount?: number;
}

// ======================
// Service API Calls
// ======================
/**
 * Query RAG AI for Doctor recommendations and healthcare questions
 */
export const queryRagService = async (payload: IQueryRagPayload) => {
  const res = await httpClient.post<IRagQueryResponse>("/rag/query", payload);
  return res;
};

/**
 * Fetch RAG Vector Embedding Stats
 */
export const getRagStatsService = async () => {
  const res = await httpClient.get<IRagStatsResponse>("/rag/stats");
  return res;
};

/**
 * Trigger Doctor Data Indexing / Re-indexing
 */
export const ingestDoctorService = async () => {
  const res = await httpClient.post<IIngestDoctorResponse>("/rag/ingest-doctor", {});
  return res;
};
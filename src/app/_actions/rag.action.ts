/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  ingestDoctorService,
  queryRagService,
  IRagDoctorRecommendation,
} from "@/src/services/rag.services";

export interface IQueryRagActionResult {
  success: boolean;
  answer?: string;
  doctors?: IRagDoctorRecommendation[];
  sources?: string;
  error?: string;
}

export const queryRagAction = async (query: string): Promise<IQueryRagActionResult> => {
  try {
    const response = await queryRagService({ query });

    if (!response?.data?.answer) {
      return {
        success: false,
        error: response?.message || "No answer received from AI. Please try again.",
      };
    }

    const rawAnswer = response.data.answer;
    let formattedAnswer = "";
    let extractedDoctors: IRagDoctorRecommendation[] = [];

    // If answer contains structured doctor objects
    if (typeof rawAnswer === "object" && rawAnswer !== null) {
      if ("doctors" in rawAnswer && Array.isArray(rawAnswer.doctors)) {
        extractedDoctors = rawAnswer.doctors;
        if (extractedDoctors.length > 0) {
          formattedAnswer =
            `I found ${extractedDoctors.length} specialist${extractedDoctors.length > 1 ? "s" : ""} matching your search:\n\n` +
            extractedDoctors
              .map((d, i) => {
                let text = `${i + 1}. **${d.name || "Doctor"}**\n`;
                if (d.specialty) text += `   - **Specialty:** ${d.specialty}\n`;
                if (d.reason) text += `   - **Recommendation:** ${d.reason}\n`;
                return text;
              })
              .join("\n");
        } else {
          formattedAnswer =
            "I couldn't find any specific doctors matching your query. Please try searching with a different specialty or condition.";
        }
      } else {
        formattedAnswer = JSON.stringify(rawAnswer, null, 2);
      }
    } else {
      formattedAnswer = String(rawAnswer);
    }

    let sourceMatchStr = "";
    if (response.data.sources && response.data.sources.length > 0) {
      const topSimilarity = response.data.sources[0]?.similarity;
      if (typeof topSimilarity === "number") {
        // Similarity is cosine distance or score
        const matchPct =
          topSimilarity <= 1
            ? Math.round((1 - topSimilarity) * 100)
            : Math.round(topSimilarity);
        const normalized = Math.max(1, Math.min(99, matchPct));
        sourceMatchStr = `${normalized}% match`;
      }
    }

    return {
      success: true,
      answer: formattedAnswer,
      doctors: extractedDoctors.length > 0 ? extractedDoctors : undefined,
      sources: sourceMatchStr || undefined,
    };
  } catch (error: any) {
    console.error("queryRagAction error:", error);
    return {
      success: false,
      error:
        error?.message ||
        "Failed to reach the AI Assistant. Please check your connection and try again.",
    };
  }
};

export const ingestDoctorsAction = async () => {
  try {
    const response = await ingestDoctorService();

    const count =
      response?.data?.indexCount ??
      response?.data?.indexedCount ??
      0;

    return {
      success: true,
      indexedCount: count,
      message:
        response?.data?.message ??
        response?.message ??
        `Doctor data synced successfully (${count} indexed).`,
    };
  } catch (error: any) {
    console.error("ingestDoctorsAction error:", error);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to sync doctor data. Please try again.",
    };
  }
};

export const getUserRoleAction = async () => {
  try {
    const { getUserInfo } = await import("@/src/services/auth.services");
    const userInfo = await getUserInfo();
    return userInfo?.role ?? null;
  } catch (error) {
    console.error("getUserRoleAction error:", error);
    return null;
  }
};
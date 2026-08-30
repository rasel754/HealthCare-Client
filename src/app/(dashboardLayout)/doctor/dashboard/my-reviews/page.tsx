"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyReviewsService } from "@/src/services/review.services";
import { IReview } from "@/src/types/domain.types";
import { Star, MessageSquare } from "lucide-react";

export default function DoctorMyReviewsPage() {
  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: ["doctor-reviews"],
    queryFn: () => getMyReviewsService(),
  });

  const reviews = (reviewsResponse && "data" in reviewsResponse ? reviewsResponse.data : []) as IReview[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Reviews & Feedback</h1>
        <p className="text-xs text-slate-500 mt-1">Read rating feedback submitted by your patients</p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <Star className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Patient Reviews Yet</h3>
          <p className="text-xs text-slate-400">Reviews submitted by patients will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">{r.patient?.name || "Anonymous Patient"}</h3>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  ★ {r.rating} / 5
                </div>
              </div>

              <p className="text-xs text-slate-600 italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                &ldquo;{r.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
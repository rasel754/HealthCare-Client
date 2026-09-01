"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllReviewsService, deleteReviewService } from "@/src/services/review.services";
import { IReview } from "@/src/types/domain.types";
import { Input } from "@/src/components/ui/input";
import { Star, Search, Trash2, User, Stethoscope } from "lucide-react";

export default function ReviewsManagementPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: ["all-reviews", searchTerm],
    queryFn: () => getAllReviewsService({ searchTerm: searchTerm || undefined, limit: 50 }),
  });

  const reviews = (reviewsResponse && "data" in reviewsResponse ? reviewsResponse.data : []) as IReview[];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReviewService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-reviews"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Reviews & Feedback Supervision</h1>
          <p className="text-xs text-slate-500 mt-1">Supervise ratings and feedback comments submitted across consultations</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by doctor or patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-white"
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading system reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <Star className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Patient Reviews Found</h3>
          <p className="text-xs text-slate-400">Reviews submitted by patients will be listed here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Doctor: {r.doctor?.name || "Dr. Assigned"}</h3>
                    <p className="text-[11px] text-slate-400">By Patient: {r.patient?.name || "Patient"}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-amber-500 font-extrabold text-sm bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      ★ {r.rating} / 5
                    </span>
                    <button
                      onClick={() => deleteMutation.mutate(r.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 italic bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
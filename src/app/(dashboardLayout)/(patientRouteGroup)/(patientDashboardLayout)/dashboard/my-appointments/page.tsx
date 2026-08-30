"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyAppointmentsService, initiatePaymentService } from "@/src/services/appointment.services";
import { createReviewService } from "@/src/services/review.services";
import { IAppointment } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Calendar, CreditCard, Video, Star, Clock, AlertCircle, CheckCircle2, X } from "lucide-react";

export default function MyAppointmentsPage() {
  const queryClient = useQueryClient();
  const [selectedReviewAppointment, setSelectedReviewAppointment] = useState<IAppointment | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);

  const { data: appointmentsResponse, isLoading } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: () => getMyAppointmentsService(),
  });

  const appointments = (appointmentsResponse && "data" in appointmentsResponse ? appointmentsResponse.data : []) as IAppointment[];

  const payMutation = useMutation({
    mutationFn: (id: string) => initiatePaymentService(id),
    onSuccess: (res) => {
      if ("data" in res && res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    },
  });

  const reviewMutation = useMutation({
    mutationFn: createReviewService,
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setReviewMsg(res.message);
      } else {
        setReviewMsg("Review submitted successfully!");
        setTimeout(() => {
          setSelectedReviewAppointment(null);
          setComment("");
          setReviewMsg(null);
          queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
        }, 1200);
      }
    },
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewAppointment) return;
    reviewMutation.mutate({
      appointmentId: selectedReviewAppointment.id,
      rating: Number(rating),
      comment,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Appointments</h1>
          <p className="text-xs text-slate-500 mt-1">Track scheduled consultations, payment status, and video session links</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Appointments Found</h3>
          <p className="text-xs text-slate-400">You haven&apos;t booked any doctor consultations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      app.status === "SCHEDULED"
                        ? "bg-blue-100 text-blue-700"
                        : app.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-700"
                        : app.status === "INPROGRESS"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {app.status}
                  </span>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      app.paymentStatus === "PAID" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}
                  >
                    {app.paymentStatus}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg">{app.doctor?.name || "Dr. Assigned"}</h3>
                <p className="text-xs text-slate-500">{app.doctor?.designation} • {app.doctor?.currentWorkingPlace}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{app.schedule?.startDate} ({app.schedule?.startTime} - {app.schedule?.endTime})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                {app.paymentStatus === "UNPAID" && app.status !== "CANCELED" && (
                  <Button
                    size="sm"
                    onClick={() => payMutation.mutate(app.id)}
                    disabled={payMutation.isPending}
                    className="rounded-xl gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CreditCard className="h-4 w-4" /> Pay Now
                  </Button>
                )}

                {app.status === "SCHEDULED" && app.videoCallingId && (
                  <a
                    href={`https://meet.jit.si/${app.videoCallingId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    <Video className="h-4 w-4" /> Join Video Call
                  </a>
                )}

                {app.status === "COMPLETED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReviewAppointment(app)}
                    className="rounded-xl gap-2 text-xs"
                  >
                    <Star className="h-4 w-4 text-amber-500" /> Give Review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedReviewAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Leave Doctor Review</h3>
              <button onClick={() => setSelectedReviewAppointment(null)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {reviewMsg && (
              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700">{reviewMsg}</div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Very Bad</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Comment</label>
                <Textarea
                  placeholder="Share your consultation experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="rounded-xl"
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={reviewMutation.isPending} className="w-full rounded-xl">
                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
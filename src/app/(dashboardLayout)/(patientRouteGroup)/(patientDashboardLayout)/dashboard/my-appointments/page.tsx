"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyAppointmentsService,
  initiatePaymentService,
  confirmPaymentService,
} from "@/src/services/appointment.services";
import { createReviewService } from "@/src/services/review.services";
import { IAppointment } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Calendar, CreditCard, Video, Star, Clock, AlertCircle, CheckCircle2, X, Sparkles, ShieldCheck } from "lucide-react";

function MyAppointmentsContent() {
  const searchParams = useSearchParams();
  const paymentStatusParam = searchParams.get("payment");
  const bookedParam = searchParams.get("booked");
  const queryClient = useQueryClient();
  const [selectedReviewAppointment, setSelectedReviewAppointment] = useState<IAppointment | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);
  const [dismissBanner, setDismissBanner] = useState(false);

  useEffect(() => {
    if (paymentStatusParam === "success" || searchParams.get("session_id") || searchParams.get("appointment_id")) {
      const appointmentId = searchParams.get("appointment_id") || undefined;
      const paymentId = searchParams.get("payment_id") || undefined;
      const sessionId = searchParams.get("session_id") || undefined;

      confirmPaymentService({
        appointmentId,
        paymentId,
        sessionId,
      })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
          queryClient.invalidateQueries({ queryKey: ["stats"] });
          queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
        })
        .catch((err) => {
          console.error("Error confirming payment on appointments page:", err);
        });
    }
  }, [paymentStatusParam, searchParams, queryClient]);

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
      {/* Payment Success Banner */}
      {!dismissBanner && (paymentStatusParam === "success" || bookedParam === "true") && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm">
                {paymentStatusParam === "success"
                  ? "Payment Confirmed! Appointment Status: PAID"
                  : "Appointment Successfully Scheduled!"}
              </p>
              <p className="text-xs text-muted-foreground">
                Your doctor consultation appointment is confirmed and ready in your schedule.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissBanner(true)}
            className="p-1 rounded-lg hover:bg-emerald-500/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Appointments</h1>
          <p className="text-xs text-muted-foreground mt-1">Track scheduled consultations, payment status, and video session links</p>
        </div>
      </div>


      {isLoading ? (
        <div className="py-16 text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-muted-foreground">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Appointments Found</h3>
          <p className="text-xs text-muted-foreground">You haven&apos;t booked any doctor consultations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((app) => (
            <div key={app.id} className="bg-card text-card-foreground rounded-2xl border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      app.status === "SCHEDULED"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        : app.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : app.status === "INPROGRESS"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {app.status}
                  </span>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      app.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {app.paymentStatus}
                  </span>
                </div>

                <h3 className="font-bold text-foreground text-lg">{app.doctor?.name || "Dr. Assigned"}</h3>
                <p className="text-xs text-muted-foreground">{app.doctor?.designation} • {app.doctor?.currentWorkingPlace}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{app.schedule?.startDate} ({app.schedule?.startTime} - {app.schedule?.endTime})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 border-t md:border-t-0 border-border pt-4 md:pt-0">
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl shadow-sm hover:bg-primary/90 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-lg">Leave Doctor Review</h3>
              <button onClick={() => setSelectedReviewAppointment(null)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>

            {reviewMsg && (
              <div className="p-3 bg-accent text-accent-foreground rounded-xl text-xs">{reviewMsg}</div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-input bg-background text-foreground rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Very Bad</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Your Comment</label>
                <Textarea
                  placeholder="Share your consultation experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="rounded-xl bg-background text-foreground border-input"
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

export default function MyAppointmentsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs text-muted-foreground">Loading appointments...</div>}>
      <MyAppointmentsContent />
    </Suspense>
  );
}
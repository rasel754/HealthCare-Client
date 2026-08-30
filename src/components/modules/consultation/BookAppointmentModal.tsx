"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getSchedulesService } from "@/src/services/schedule.services";
import { bookAppointmentService, bookAppointmentWithPayLaterService } from "@/src/services/appointment.services";
import { IDoctor, ISchedule } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Calendar, Clock, CreditCard, DollarSign, CheckCircle2, AlertCircle, X, Stethoscope } from "lucide-react";

interface BookAppointmentModalProps {
  doctor: IDoctor;
  onClose: () => void;
}

export default function BookAppointmentModal({ doctor, onClose }: BookAppointmentModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [payLater, setPayLater] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch available schedule slots
  const { data: schedulesResponse, isLoading: loadingSchedules } = useQuery({
    queryKey: ["schedules"],
    queryFn: () => getSchedulesService({ limit: 50 }),
  });

  const schedules = (schedulesResponse && "data" in schedulesResponse ? schedulesResponse.data : []) as ISchedule[];

  const bookPayNowMutation = useMutation({
    mutationFn: bookAppointmentService,
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else if ("data" in res && res.data) {
        const { paymentUrl } = res.data;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          setSuccessMsg("Appointment booked! Redirecting to appointments...");
          setTimeout(() => router.push("/dashboard/my-appointments"), 1500);
        }
      }
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to book appointment"),
  });

  const bookPayLaterMutation = useMutation({
    mutationFn: bookAppointmentWithPayLaterService,
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg("Appointment booked successfully with Pay Later! Redirecting...");
        setTimeout(() => router.push("/dashboard/my-appointments"), 1500);
      }
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to book appointment"),
  });

  const handleBook = () => {
    setErrorMsg(null);
    if (!selectedScheduleId) {
      setErrorMsg("Please select an available schedule slot");
      return;
    }

    const payload = {
      doctorId: doctor.id,
      scheduleId: selectedScheduleId,
    };

    if (payLater) {
      bookPayLaterMutation.mutate(payload);
    } else {
      bookPayNowMutation.mutate(payload);
    }
  };

  const isSubmitting = bookPayNowMutation.isPending || bookPayLaterMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xl">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">{doctor.name}</h3>
              <p className="text-xs text-slate-300 font-medium">{doctor.designation} • {doctor.currentWorkingPlace}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Fee Information */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Consultation Fee</p>
              <p className="text-2xl font-extrabold text-slate-900">${doctor.appointmentFee}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-semibold uppercase">Experience</p>
              <p className="text-sm font-bold text-slate-700">{doctor.experience || 0} Years</p>
            </div>
          </div>

          {/* Schedule Slots */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Select Available Time Slot
            </h4>

            {loadingSchedules ? (
              <p className="text-xs text-slate-400">Loading schedule slots...</p>
            ) : schedules.length === 0 ? (
              <p className="text-xs text-rose-500 bg-rose-50 p-3 rounded-xl">No active schedule slots available for this doctor.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {schedules.map((slot) => {
                  const isSelected = selectedScheduleId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedScheduleId(slot.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 font-bold text-primary shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-1 font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{slot.startDate}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Method Choice */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">Choose Payment Method</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayLater(false)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  !payLater
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-bold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-xs font-bold">Pay Now (Stripe)</p>
                  <p className="text-[10px] text-slate-400 font-normal">Instant Checkout</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPayLater(true)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  payLater
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-bold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-xs font-bold">Pay Later</p>
                  <p className="text-[10px] text-slate-400 font-normal">Book without instant pay</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleBook} disabled={isSubmitting || !selectedScheduleId} className="rounded-xl px-6">
            {isSubmitting ? "Booking..." : payLater ? "Confirm Booking (Pay Later)" : "Proceed to Pay"}
          </Button>
        </div>
      </div>
    </div>
  );
}

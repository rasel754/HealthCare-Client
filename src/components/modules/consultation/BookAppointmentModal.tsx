"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getAllDoctorSchedulesService } from "@/src/services/schedule.services";
import { bookAppointmentService, bookAppointmentWithPayLaterService } from "@/src/services/appointment.services";
import { IDoctor, IDoctorSchedule } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Calendar, Clock, CreditCard, DollarSign, CheckCircle2, AlertCircle, X, Stethoscope } from "lucide-react";

interface BookAppointmentModalProps {
  doctor: IDoctor;
  onClose: () => void;
}

const formatSlotDate = (startDateTime?: string) => {
  if (!startDateTime) return "N/A";
  return new Date(startDateTime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatSlotTime = (startDateTime?: string, endDateTime?: string) => {
  if (!startDateTime || !endDateTime) return "N/A";
  const start = new Date(startDateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(endDateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${start} - ${end}`;
};

export default function BookAppointmentModal({ doctor, onClose }: BookAppointmentModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [payLater, setPayLater] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch available schedule slots specific to this doctor
  const { data: schedulesResponse, isLoading: loadingSchedules } = useQuery({
    queryKey: ["doctor-schedules", doctor.id],
    queryFn: () => getAllDoctorSchedulesService({ doctorId: doctor.id, isBooked: false, limit: 100 }),
    enabled: Boolean(doctor?.id),
  });

  const doctorSchedules = (schedulesResponse && "data" in schedulesResponse ? schedulesResponse.data : []) as IDoctorSchedule[];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card text-card-foreground w-full max-w-lg rounded-3xl shadow-2xl border border-border overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-xl">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">{doctor.name}</h3>
              <p className="text-xs text-white/80 font-medium">{doctor.designation} • {doctor.currentWorkingPlace}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Fee Information */}
          <div className="bg-accent/40 border border-border rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Consultation Fee</p>
              <p className="text-2xl font-extrabold text-foreground">${doctor.appointmentFee}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-semibold uppercase">Experience</p>
              <p className="text-sm font-bold text-foreground">{doctor.experience || 0} Years</p>
            </div>
          </div>

          {/* Schedule Slots */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Select Available Time Slot
            </h4>

            {loadingSchedules ? (
              <p className="text-xs text-muted-foreground">Loading schedule slots...</p>
            ) : doctorSchedules.length === 0 ? (
              <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">No active schedule slots available for this doctor.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {doctorSchedules.map((ds) => {
                  const slot = ds.schedule;
                  if (!slot) return null;
                  const isSelected = selectedScheduleId === slot.id;
                  return (
                    <button
                      key={ds.scheduleId || slot.id}
                      type="button"
                      onClick={() => setSelectedScheduleId(slot.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 font-bold text-primary shadow-xs"
                          : "border-border bg-card text-foreground hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{formatSlotDate(slot.startDateTime)}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {formatSlotTime(slot.startDateTime, slot.endDateTime)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Method Choice */}
          <div className="space-y-3 pt-2 border-t border-border">
            <h4 className="text-sm font-bold text-foreground">Choose Payment Method</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayLater(false)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  !payLater
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20 text-primary font-bold"
                    : "border-border text-foreground hover:bg-accent"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-xs font-bold">Pay Now (Stripe)</p>
                  <p className="text-[10px] text-muted-foreground font-normal">Instant Checkout</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPayLater(true)}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  payLater
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20 text-primary font-bold"
                    : "border-border text-foreground hover:bg-accent"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-xs font-bold">Pay Later</p>
                  <p className="text-[10px] text-muted-foreground font-normal">Book without instant pay</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-accent/30 border-t border-border flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleBook} disabled={isSubmitting || !selectedScheduleId} className="rounded-xl px-6 font-semibold">
            {isSubmitting ? "Booking..." : payLater ? "Confirm Booking (Pay Later)" : "Proceed to Pay"}
          </Button>
        </div>
      </div>
    </div>
  );
}

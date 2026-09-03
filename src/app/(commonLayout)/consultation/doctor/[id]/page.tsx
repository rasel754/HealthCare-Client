"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDoctorByIdService } from "@/src/services/doctor.services";
import { getAllDoctorSchedulesService } from "@/src/services/schedule.services";
import {
  bookAppointmentService,
  bookAppointmentWithPayLaterService,
} from "@/src/services/appointment.services";
import { IDoctor, IDoctorSchedule } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Award,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const formatSlotDate = (startDateTime?: string) => {
  if (!startDateTime) return "N/A";
  return new Date(startDateTime).toLocaleDateString("en-US", {
    weekday: "short",
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

export default function ConsultationDoctorByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);

  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "pay_later">("stripe");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch Doctor Profile
  const { data: doctorResponse, isLoading: loadingDoctor } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorByIdService(id),
  });

  // Fetch Doctor's unbooked schedule slots
  const { data: schedulesResponse, isLoading: loadingSchedules } = useQuery({
    queryKey: ["doctor-schedules", id],
    queryFn: () => getAllDoctorSchedulesService({ doctorId: id, isBooked: false, limit: 100 }),
    enabled: Boolean(id),
  });

  const doctor = (doctorResponse && "data" in doctorResponse ? doctorResponse.data : null) as IDoctor | null;
  const doctorSchedules = (schedulesResponse && "data" in schedulesResponse ? schedulesResponse.data : []) as IDoctorSchedule[];

  // Group schedules by date for easy tab selection
  const schedulesByDate = useMemo(() => {
    const map = new Map<string, IDoctorSchedule[]>();
    doctorSchedules.forEach((ds) => {
      const slot = ds.schedule;
      if (!slot?.startDateTime) return;
      const dateKey = new Date(slot.startDateTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(ds);
    });
    return Array.from(map.entries());
  }, [doctorSchedules]);

  const [activeDateTab, setActiveDateTab] = useState<string>("");

  const currentSlotsToDisplay = useMemo(() => {
    if (schedulesByDate.length === 0) return [];
    if (!activeDateTab && schedulesByDate[0]) {
      return schedulesByDate[0][1];
    }
    const found = schedulesByDate.find(([date]) => date === activeDateTab);
    return found ? found[1] : schedulesByDate[0] ? schedulesByDate[0][1] : [];
  }, [schedulesByDate, activeDateTab]);

  const selectedSlot = useMemo(() => {
    return doctorSchedules.find((ds) => ds.schedule?.id === selectedScheduleId || ds.scheduleId === selectedScheduleId);
  }, [doctorSchedules, selectedScheduleId]);

  const handleCheckoutAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedScheduleId) {
      setErrorMsg("Please select an available appointment time slot.");
      return;
    }

    if (!doctor) {
      setErrorMsg("Doctor profile not found.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      if (paymentMethod === "pay_later") {
        const res = await bookAppointmentWithPayLaterService({
          doctorId: doctor.id,
          scheduleId: selectedScheduleId,
        });

        if ("success" in res && !res.success) {
          setErrorMsg(res.message || "Failed to book appointment");
          setIsProcessingPayment(false);
          return;
        }

        // Invalidate queries so dashboard reflects appointment
        await queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
        await queryClient.invalidateQueries({ queryKey: ["doctor-schedules"] });
        await queryClient.invalidateQueries({ queryKey: ["stats"] });

        setSuccessMsg("Appointment booked successfully with Pay Later! Redirecting to My Appointments...");
        setTimeout(() => {
          router.push("/dashboard/my-appointments?booked=true");
        }, 1000);
      } else {
        // Pay Online via Stripe
        const res = await bookAppointmentService({
          doctorId: doctor.id,
          scheduleId: selectedScheduleId,
        });

        if ("success" in res && !res.success) {
          setErrorMsg(res.message || "Failed to initiate payment checkout");
          setIsProcessingPayment(false);
          return;
        }

        if ("data" in res && res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        } else {
          router.push("/dashboard/my-appointments?payment=success&status=PAID");
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An error occurred during booking and payment checkout.");
      setIsProcessingPayment(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-muted-foreground">Loading Specialist Doctor Profile & Booking Gateway...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <Stethoscope className="h-14 w-14 text-muted-foreground mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Doctor Profile Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested specialist doctor profile could not be located.</p>
        <Link href="/consultation">
          <Button variant="outline" className="rounded-xl gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Doctor Directory
          </Button>
        </Link>
      </div>
    );
  }

  const specialtiesList = doctor.doctorSpecialties || [];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/consultation"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Doctor Directory
        </Link>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Instant Doctor Reservation & Checkout
        </span>
      </div>

      {/* Main Grid: Left Doctor Profile & Time Slots, Right Payment Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Doctor Full Profile & Schedule Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Doctor Full Profile Card */}
          <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-border">
              <div className="h-28 w-28 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-4xl shrink-0 overflow-hidden shadow-sm border-2 border-primary/20">
                {doctor.profilePhoto ? (
                  <img src={doctor.profilePhoto} alt={doctor.name} className="h-full w-full object-cover" />
                ) : (
                  doctor.name[0]
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{doctor.name}</h1>
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                </div>
                <p className="text-sm font-bold text-primary">{doctor.designation}</p>
                <p className="text-xs text-muted-foreground font-medium">{doctor.qualification}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  <span className="font-bold text-amber-500">★ {doctor.averageRating ? doctor.averageRating.toFixed(1) : "5.0"} Rating</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground font-medium">{doctor.experience || 0} Years Experience</span>
                </div>
              </div>
            </div>

            {/* Doctor Key Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-accent/40 border border-border p-3.5 rounded-2xl space-y-1">
                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-wider">Hospital Affiliation</p>
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{doctor.currentWorkingPlace || "Central Hospital"}</span>
                </div>
              </div>

              <div className="bg-accent/40 border border-border p-3.5 rounded-2xl space-y-1">
                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-wider">Registration</p>
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Award className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{doctor.registrationNumber}</span>
                </div>
              </div>

              <div className="bg-accent/40 border border-border p-3.5 rounded-2xl space-y-1">
                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-wider">Consultation Fee</p>
                <div className="flex items-center gap-1.5 font-extrabold text-primary text-base">
                  <span>${doctor.appointmentFee}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">/ session</span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialties & Expertise</p>
              {specialtiesList.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">General Medicine & Consultations</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {specialtiesList.map((ds) => (
                    <span
                      key={ds.specialtiesId}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-xl border border-primary/20"
                    >
                      {ds.specialties?.title || "Specialty"}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Time Slots Card */}
          <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> Select Available Time Slot
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pick your preferred consultation date and available hour
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
                {doctorSchedules.length} Slots Available
              </span>
            </div>

            {loadingSchedules ? (
              <div className="py-8 text-center text-xs text-muted-foreground">Loading doctor schedule slots...</div>
            ) : doctorSchedules.length === 0 ? (
              <div className="p-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-2">
                <Calendar className="h-8 w-8 text-rose-500 mx-auto" />
                <h4 className="text-sm font-bold text-foreground">No Open Slots Currently</h4>
                <p className="text-xs text-muted-foreground">This doctor does not have active available slots at the moment. Please check back soon.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Date Tabs */}
                {schedulesByDate.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {schedulesByDate.map(([dateKey, slots]) => {
                      const isActive = (activeDateTab || schedulesByDate[0][0]) === dateKey;
                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => setActiveDateTab(dateKey)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "bg-accent/60 text-foreground hover:bg-accent border border-border"
                          }`}
                        >
                          {dateKey} ({slots.length})
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Slots Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {currentSlotsToDisplay.map((ds) => {
                    const slot = ds.schedule;
                    if (!slot) return null;
                    const isSelected = selectedScheduleId === slot.id || selectedScheduleId === ds.scheduleId;
                    return (
                      <button
                        key={ds.scheduleId || slot.id}
                        type="button"
                        onClick={() => setSelectedScheduleId(slot.id || ds.scheduleId)}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-2 ring-primary/30 font-bold text-foreground shadow-sm"
                            : "border-border bg-card text-foreground hover:bg-accent/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span>{formatSlotDate(slot.startDateTime)}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5 font-medium">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {formatSlotTime(slot.startDateTime, slot.endDateTime)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Complete Payment Checkout Procedure (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 sm:p-8 shadow-xl space-y-6 sticky top-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Checkout & Payment
                </h2>
                <p className="text-xs text-muted-foreground">Complete consultation reservation</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Lock className="h-3 w-3" /> 256-Bit SSL
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCheckoutAndBook} className="space-y-6">
              {/* Selected Slot Summary Chip */}
              <div className="bg-accent/40 border border-border rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Selected Slot</span>
                  <span className="font-bold text-primary">
                    {selectedSlot ? "Confirmed" : "None Selected"}
                  </span>
                </div>
                {selectedSlot ? (
                  <div className="text-xs font-bold text-foreground">
                    {formatSlotDate(selectedSlot.schedule?.startDateTime)} • {formatSlotTime(selectedSlot.schedule?.startDateTime, selectedSlot.schedule?.endDateTime)}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Please click an available slot from the schedule panel</p>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === "stripe"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-2 ring-primary/20"
                        : "border-border bg-card text-foreground hover:bg-accent text-xs font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <CreditCard className="h-5 w-5 text-primary" />
                      {paymentMethod === "stripe" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <span className="text-xs font-bold block">Pay Online</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Card / Gateway Checkout</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("pay_later")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === "pay_later"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-2 ring-primary/20"
                        : "border-border bg-card text-foreground hover:bg-accent text-xs font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Calendar className="h-5 w-5 text-primary" />
                      {paymentMethod === "pay_later" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <span className="text-xs font-bold block">Pay Later</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Reserve without instant pay</span>
                  </button>
                </div>
              </div>

              {/* Online Gateway Info Banner */}
              {paymentMethod === "stripe" && (
                <div className="p-4 rounded-2xl bg-accent/30 border border-border space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-bold text-foreground text-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Secure Online Payment Gateway</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    You will proceed to our encrypted payment checkout gateway to complete your payment with Credit/Debit Card. Upon successful payment, you will be redirected to your <strong>My Appointments</strong> page with status updated to <strong>Paid</strong>.
                  </p>
                </div>
              )}

              {/* Pay Later Info Banner */}
              {paymentMethod === "pay_later" && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs text-amber-700 dark:text-amber-300">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <span>Pay Later Consultation Reservation</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Your appointment time slot will be reserved. You can settle the fee anytime before your consultation from the My Appointments portal.
                  </p>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-2 pt-4 border-t border-border text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Consultation Fee</span>
                  <span className="font-semibold text-foreground">${doctor.appointmentFee}.00</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Platform & Processing Fee</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE ($0.00)</span>
                </div>
                <div className="flex items-center justify-between text-sm font-extrabold text-foreground pt-2 border-t border-border/80">
                  <span>Total Payable</span>
                  <span className="text-xl text-primary font-extrabold">
                    {paymentMethod === "pay_later" ? `$0.00 (Due Later)` : `$${doctor.appointmentFee}.00`}
                  </span>
                </div>
              </div>

              {/* Submit Checkout Button */}
              <Button
                type="submit"
                disabled={isProcessingPayment || !selectedScheduleId}
                className="w-full h-12 rounded-2xl font-bold text-sm shadow-md gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Processing & Redirecting...
                  </>
                ) : paymentMethod === "pay_later" ? (
                  <>
                    Confirm Booking (Pay Later) <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Proceed to Secure Payment (${doctor.appointmentFee})
                  </>
                )}
              </Button>

              <p className="text-[10px] text-center text-muted-foreground">
                By clicking confirm, you agree to the healthcare terms of service and consultation cancellation policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
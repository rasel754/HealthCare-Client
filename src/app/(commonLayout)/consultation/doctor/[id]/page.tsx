"use client";

import { use, useState } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { useQuery } from "@tanstack/react-query";
import { getDoctorByIdService } from "@/src/services/doctor.services";
import { getAllDoctorSchedulesService } from "@/src/services/schedule.services";
import { IDoctor, IDoctorSchedule } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Stethoscope, Calendar, Clock, MapPin, Award, ArrowLeft, ShieldCheck } from "lucide-react";
import BookAppointmentModal from "@/src/components/modules/consultation/BookAppointmentModal";

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

export default function ConsultationDoctorByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { data: doctorResponse, isLoading: loadingDoctor } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorByIdService(id),
  });

  const { data: schedulesResponse } = useQuery({
    queryKey: ["doctor-schedules", id],
    queryFn: () => getAllDoctorSchedulesService({ doctorId: id, isBooked: false, limit: 100 }),
    enabled: Boolean(id),
  });

  const doctor = (doctorResponse && "data" in doctorResponse ? doctorResponse.data : null) as IDoctor | null;
  const doctorSchedules = (schedulesResponse && "data" in schedulesResponse ? schedulesResponse.data : []) as IDoctorSchedule[];

  if (loadingDoctor) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-slate-500">Loading Doctor Profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <Stethoscope className="h-12 w-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Doctor Profile Not Found</h2>
        <p className="text-xs text-slate-500">The requested specialist doctor profile could not be located.</p>
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
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link href="/consultation" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to All Doctors
      </Link>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-5">
            <div className="h-24 w-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl shrink-0 overflow-hidden shadow-sm">
              {doctor.profilePhoto ? (
                <img src={doctor.profilePhoto} alt={doctor.name} className="h-full w-full object-cover" />
              ) : (
                doctor.name[0]
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{doctor.name}</h1>
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-primary">{doctor.designation}</p>
              <p className="text-xs text-slate-500 font-medium">{doctor.qualification}</p>
              <div className="flex items-center gap-2 text-xs text-amber-500 font-bold pt-1">
                <span>★ {doctor.averageRating ? doctor.averageRating.toFixed(1) : "5.0"}</span>
                <span className="text-slate-400 font-normal">• Certified Medical Specialist</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center md:text-right space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultation Fee</p>
            <p className="text-3xl font-extrabold text-slate-900">${doctor.appointmentFee}</p>
            <Button onClick={() => setIsBookingOpen(true)} className="w-full md:w-auto rounded-xl px-6 h-11 font-semibold gap-2 shadow-sm">
              <Calendar className="h-4 w-4" /> Book Consultation Slot
            </Button>
          </div>
        </div>

        {/* Doctor Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-700">
          <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Current Working Hospital</p>
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{doctor.currentWorkingPlace || "Central Specialized Hospital"}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Clinical Experience</p>
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Award className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{doctor.experience || 0} Years Active Practice</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">BMDC Reg. Number</p>
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>{doctor.registrationNumber}</span>
            </div>
          </div>
        </div>

        {/* Medical Specialties Tags */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Medical Specialties</h3>
          {specialtiesList.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No specific specialty categories linked.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {specialtiesList.map((ds) => (
                <span
                  key={ds.specialtiesId}
                  className="px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl border border-primary/20"
                >
                  {ds.specialties?.title || "Specialty Category"}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Master Schedules Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Active Schedule Slot Intervals
          </h3>
          <Button onClick={() => setIsBookingOpen(true)} variant="outline" className="rounded-xl text-xs font-semibold">
            View All Slots & Book
          </Button>
        </div>

        {doctorSchedules.length === 0 ? (
          <p className="text-xs text-slate-400">No active consultation schedule slots assigned by this doctor at this moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {doctorSchedules.slice(0, 6).map((ds) => {
              const slot = ds.schedule;
              if (!slot) return null;
              return (
                <div key={ds.scheduleId || slot.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{formatSlotDate(slot.startDateTime)}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Open</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{formatSlotTime(slot.startDateTime, slot.endDateTime)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookAppointmentModal doctor={doctor} onClose={() => setIsBookingOpen(false)} />
      )}
    </div>
  );
}
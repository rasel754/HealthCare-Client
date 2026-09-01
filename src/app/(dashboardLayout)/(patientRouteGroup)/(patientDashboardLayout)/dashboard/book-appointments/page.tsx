"use client";

import DoctorList from "@/src/components/modules/consultation/doctorList";

export default function BookAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Book Doctor Consultations</h1>
        <p className="text-xs text-slate-500 mt-1">Discover top medical specialists and reserve available time slots</p>
      </div>

      <div className="bg-slate-50/50 rounded-3xl border border-slate-200/80 p-2 sm:p-4">
        <DoctorList />
      </div>
    </div>
  );
}
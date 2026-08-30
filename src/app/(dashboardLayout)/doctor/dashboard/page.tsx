"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/src/services/stats.services";
import { getMyAppointmentsService } from "@/src/services/appointment.services";
import { IDashboardStats, IAppointment } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Calendar, Users, Star, DollarSign, Clock, ArrowRight, Video, FileText } from "lucide-react";

export default function DoctorDashboardPage() {
  const { data: statsResponse } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getDashboardStatsService(),
  });

  const { data: appointmentsResponse } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: () => getMyAppointmentsService({ limit: 5 }),
  });

  const stats = (statsResponse && "data" in statsResponse ? statsResponse.data : {}) as IDashboardStats;
  const appointments = (appointmentsResponse && "data" in appointmentsResponse ? appointmentsResponse.data : []) as IAppointment[];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase">
            Doctor Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Clinical Dashboard</h2>
          <p className="text-sm text-primary-foreground/80 max-w-lg">
            Manage your patient appointments, assign consultation schedule slots, and issue digital prescriptions.
          </p>
        </div>
        <Link href="/doctor/dashboard/my-schedules">
          <Button size="lg" variant="secondary" className="rounded-xl font-bold gap-2">
            <Clock className="h-5 w-5" /> Manage Available Slots
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Appointments</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.appointmentCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Patients</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.patientCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Patient Reviews</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.reviewCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Revenue Earned</p>
            <p className="text-2xl font-extrabold text-slate-900">${stats.totalRevenue || 0}</p>
          </div>
        </div>
      </div>

      {/* Doctor Appointments Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">Upcoming Patient Consultations</h3>
          <Link href="/doctor/dashboard/appointments" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
            Manage All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-400">No active patient bookings queued.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((app) => (
              <div key={app.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{app.patient?.name || "Patient"}</h4>
                  <p className="text-xs text-slate-500">
                    {app.schedule?.startDate} • {app.schedule?.startTime} - {app.schedule?.endTime}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                    {app.status}
                  </span>
                  {app.videoCallingId && (
                    <a
                      href={`https://meet.jit.si/${app.videoCallingId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <Video className="h-3.5 w-3.5" /> Start Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
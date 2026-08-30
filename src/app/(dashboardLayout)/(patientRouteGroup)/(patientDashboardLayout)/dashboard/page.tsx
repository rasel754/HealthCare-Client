"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMeService } from "@/src/services/auth.services";
import { getDashboardStatsService } from "@/src/services/stats.services";
import { getMyAppointmentsService } from "@/src/services/appointment.services";
import { IDashboardStats, IAppointment } from "@/src/types/domain.types";
import { Role } from "@/src/types/auth.type";
import { Button } from "@/src/components/ui/button";
import { Calendar, FileText, Star, Activity, PlusCircle, ArrowRight, Video, Clock } from "lucide-react";

export default function PatientDashboardPage() {
  const router = useRouter();

  const { data: userResponse } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMeService(),
  });

  const user = userResponse && "data" in userResponse ? userResponse.data : null;

  useEffect(() => {
    if (user) {
      if (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) {
        router.replace("/admin/dashboard");
      } else if (user.role === Role.DOCTOR) {
        router.replace("/doctor/dashboard");
      }
    }
  }, [user, router]);

  const { data: statsResponse } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getDashboardStatsService(),
  });

  const { data: appointmentsResponse } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: () => getMyAppointmentsService({ limit: 5 }),
  });

  const stats = (statsResponse && "data" in statsResponse ? statsResponse.data : {}) as IDashboardStats;
  const appointments = (appointmentsResponse && "data" in appointmentsResponse ? appointmentsResponse.data : []) as IAppointment[];

  const upcomingAppointment = appointments.find((a) => a.status === "SCHEDULED");

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold uppercase">
            <Activity className="h-4 w-4 text-primary" /> Patient Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome Back to HealthCare</h2>
          <p className="text-sm text-slate-300 max-w-lg">
            Manage your doctor appointments, digital prescriptions, and health medical records in one place.
          </p>
        </div>
        <Link href="/consultation">
          <Button size="lg" className="rounded-xl gap-2 h-12 px-6 font-semibold shadow-lg shadow-primary/20">
            <PlusCircle className="h-5 w-5" /> Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Appointments</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.appointmentCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Prescriptions Issued</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.reviewCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Reviews Given</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.reviewCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Next Upcoming Appointment & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Next Scheduled Appointment</h3>
            <Link href="/dashboard/my-appointments" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {upcomingAppointment ? (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{upcomingAppointment.doctor?.name || "Dr. Assigned"}</h4>
                  <p className="text-xs text-slate-500 font-medium">{upcomingAppointment.doctor?.designation || "Specialist Doctor"}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {upcomingAppointment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 border-t border-slate-200 pt-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{upcomingAppointment.schedule?.startDate} ({upcomingAppointment.schedule?.startTime})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">Video Room Active</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No Upcoming Appointments</p>
              <p className="text-xs text-slate-400">Book a consultation with a specialist doctor anytime.</p>
              <Link href="/consultation">
                <Button size="sm" className="rounded-xl mt-2">Book Doctor</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-lg">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              href="/dashboard/my-appointments"
              className="block p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-slate-800"
            >
              📅 Manage My Appointments
            </Link>
            <Link
              href="/dashboard/my-prescriptions"
              className="block p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-slate-800"
            >
              💊 View Issued Prescriptions
            </Link>
            <Link
              href="/dashboard/health-record"
              className="block p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-slate-800"
            >
              📋 Update Health Profile & Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/src/services/stats.services";
import { getAllAppointmentsService } from "@/src/services/appointment.services";
import { IDashboardStats, IAppointment } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { AppointmentCharts } from "@/src/components/modules/dashboard/AppointmentCharts";
import { Stethoscope, Users, Calendar, DollarSign, Activity, PlusCircle, ShieldCheck, Clock, Layers } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: statsResponse } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getDashboardStatsService(),
  });

  const { data: appointmentsResponse, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ["admin-all-appointments"],
    queryFn: () => getAllAppointmentsService(),
  });

  const stats = (statsResponse && "data" in statsResponse ? statsResponse.data : {}) as IDashboardStats;
  const appointments = (appointmentsResponse && "data" in appointmentsResponse ? appointmentsResponse.data : []) as IAppointment[];

  return (
    <div className="space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold uppercase">
            <ShieldCheck className="h-4 w-4 text-primary" /> Admin Control Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">HealthCare System Overview</h2>
          <p className="text-sm text-slate-300 max-w-lg">
            Supervise system appointments, onboard verified specialist doctors, configure schedule time slots, and manage medical specialties.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/dashboard/doctors-management">
            <Button size="lg" className="rounded-xl gap-2 font-semibold shadow-lg shadow-primary/20">
              <PlusCircle className="h-5 w-5" /> Add New Doctor
            </Button>
          </Link>
          <Link href="/admin/dashboard/specialties-management">
            <Button size="lg" variant="outline" className="rounded-xl font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Layers className="h-5 w-5" /> Manage Specialties
            </Button>
          </Link>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-3">
            <Calendar className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase">Appointments</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{stats.appointmentCount || appointments.length || 0}</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3">
            <Stethoscope className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase">Total Doctors</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{stats.doctorCount || 0}</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3">
            <Users className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase">Total Patients</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{stats.patientCount || 0}</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3">
            <Activity className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase">Total Users</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{stats.userCount || 0}</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mb-3">
            <DollarSign className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase">Total Revenue</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">${stats.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Role-Based System Wide Appointment Pie and Bar Charts */}
      <AppointmentCharts
        appointments={appointments}
        scopeTitle="System-Wide Appointment Analytics"
        scopeSubtitle="Aggregated real-time appointment status distribution & timeline across all doctors and patients"
        badgeLabel="Admin & Super Admin System View"
        isLoading={isAppointmentsLoading}
      />

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/dashboard/doctors-management" className="bg-card text-card-foreground p-6 rounded-3xl border border-border hover:shadow-lg hover:border-primary/40 transition-all space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-foreground text-lg">Doctors Management</h3>
          <p className="text-xs text-muted-foreground">Create new doctor accounts, assign specialty designations, update credentials, or soft-delete accounts.</p>
        </Link>

        <Link href="/admin/dashboard/specialties-management" className="bg-card text-card-foreground p-6 rounded-3xl border border-border hover:shadow-lg hover:border-primary/40 transition-all space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-foreground text-lg">Medical Specialties</h3>
          <p className="text-xs text-muted-foreground">Create medical specialty categories with icon image uploads for patient search filtering.</p>
        </Link>

        <Link href="/admin/dashboard/schedules-management" className="bg-card text-card-foreground p-6 rounded-3xl border border-border hover:shadow-lg hover:border-primary/40 transition-all space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-foreground text-lg">Schedule Time Slots</h3>
          <p className="text-xs text-muted-foreground">Generate date range & time interval schedule slots available for doctor assignments.</p>
        </Link>
      </div>
    </div>
  );
}
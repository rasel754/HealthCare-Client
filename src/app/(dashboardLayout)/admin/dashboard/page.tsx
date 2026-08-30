"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/src/services/stats.services";
import { IDashboardStats } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Stethoscope, Users, Calendar, DollarSign, Activity, PlusCircle, ShieldCheck, Clock, Layers } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: statsResponse } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getDashboardStatsService(),
  });

  const stats = (statsResponse && "data" in statsResponse ? statsResponse.data : {}) as IDashboardStats;

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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
            <Calendar className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Appointments</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.appointmentCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
            <Stethoscope className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Total Doctors</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.doctorCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
            <Users className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Total Patients</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.patientCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
            <Activity className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Total Users</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.userCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-3">
            <DollarSign className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">${stats.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/dashboard/doctors-management" className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-lg transition-all space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Doctors Management</h3>
          <p className="text-xs text-slate-500">Create new doctor accounts, assign specialty designations, update credentials, or soft-delete accounts.</p>
        </Link>

        <Link href="/admin/dashboard/specialties-management" className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-lg transition-all space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Medical Specialties</h3>
          <p className="text-xs text-slate-500">Create medical specialty categories with icon image uploads for patient search filtering.</p>
        </Link>

        <Link href="/admin/dashboard/schedules-management" className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-lg transition-all space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Schedule Time Slots</h3>
          <p className="text-xs text-slate-500">Generate date range & time interval schedule slots available for doctor assignments.</p>
        </Link>
      </div>
    </div>
  );
}
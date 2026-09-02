"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllDoctorSchedulesService } from "@/src/services/schedule.services";
import { IDoctorSchedule } from "@/src/types/domain.types";
import { Input } from "@/src/components/ui/input";
import { Clock, Search, Calendar, Stethoscope, CheckCircle2 } from "lucide-react";

export default function DoctorSchedulesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: schedulesResponse, isLoading } = useQuery({
    queryKey: ["all-doctor-schedules", searchTerm],
    queryFn: () => getAllDoctorSchedulesService({ searchTerm: searchTerm || undefined, limit: 50 }),
  });

  const schedules = (schedulesResponse && "data" in schedulesResponse ? schedulesResponse.data : []) as IDoctorSchedule[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Doctor Assigned Schedules</h1>
          <p className="text-xs text-muted-foreground mt-1">Overview of time slots claimed by specialist doctors</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by doctor name or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-background text-foreground border-input"
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">Loading doctor schedules...</div>
      ) : schedules.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Doctor Schedules Found</h3>
          <p className="text-xs text-muted-foreground">Time slot assignments will appear when doctors select master schedules.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((ds) => (
            <div key={`${ds.doctorId}-${ds.scheduleId}`} className="bg-card text-card-foreground rounded-3xl border border-border p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">{ds.doctor?.name || "Doctor"}</h3>
                  <p className="text-xs text-primary font-medium">{ds.doctor?.designation || "Specialist"}</p>
                </div>
              </div>

              <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-2 text-xs text-foreground">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{ds.schedule?.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Time: {ds.schedule?.startTime} - {ds.schedule?.endTime}</span>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Booking Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${ds.isBooked ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"}`}>
                    {ds.isBooked ? "BOOKED" : "AVAILABLE"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAppointmentsService, changeAppointmentStatusService } from "@/src/services/appointment.services";
import { IAppointment } from "@/src/types/domain.types";
import { AppointmentStatus } from "@/src/types/auth.type";
import { Calendar, Clock, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function AppointmentsManagementPage() {
  const queryClient = useQueryClient();
  const { data: appointmentsResponse, isLoading } = useQuery({
    queryKey: ["all-appointments"],
    queryFn: () => getAllAppointmentsService(),
  });

  const appointments = (appointmentsResponse && "data" in appointmentsResponse ? appointmentsResponse.data : []) as IAppointment[];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) => changeAppointmentStatusService(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-appointments"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Appointments Supervision</h1>
        <p className="text-xs text-slate-500 mt-1">Supervise patient-doctor appointment bookings across the platform</p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading system appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Appointments Recorded</h3>
          <p className="text-xs text-slate-400">System appointments will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase bg-blue-100 text-blue-700">
                    {app.status}
                  </span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {app.paymentStatus}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">Doctor: {app.doctor?.name || "Dr. Assigned"}</h3>
                <p className="text-xs text-slate-500">Patient: {app.patient?.name || "Patient"}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{app.schedule?.startDate} ({app.schedule?.startTime} - {app.schedule?.endTime})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => statusMutation.mutate({ id: app.id, status: AppointmentStatus.COMPLETED })}
                  className="rounded-xl text-xs"
                >
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => statusMutation.mutate({ id: app.id, status: AppointmentStatus.CANCELED })}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
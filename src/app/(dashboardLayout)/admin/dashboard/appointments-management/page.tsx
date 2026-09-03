"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAppointmentsService, changeAppointmentStatusService } from "@/src/services/appointment.services";
import { IAppointment } from "@/src/types/domain.types";
import { AppointmentStatus } from "@/src/types/auth.type";
import { Calendar, Clock, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ClinicalCardGridSkeleton } from "@/src/components/shared/ClinicalSkeleton";

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
        <h1 className="text-2xl font-bold text-foreground tracking-tight">System Appointments Supervision</h1>
        <p className="text-xs text-muted-foreground mt-1">Supervise patient-doctor appointment bookings across the platform</p>
      </div>

      {isLoading ? (
        <ClinicalCardGridSkeleton count={4} columnsClassName="grid-cols-1" message="Loading system appointments..." />
      ) : appointments.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Appointments Recorded</h3>
          <p className="text-xs text-muted-foreground">System appointments will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((app) => (
            <div key={app.id} className="bg-card text-card-foreground rounded-2xl border border-border p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {app.status}
                  </span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {app.paymentStatus}
                  </span>
                </div>

                <h3 className="font-bold text-foreground text-base">Doctor: {app.doctor?.name || "Dr. Assigned"}</h3>
                <p className="text-xs text-muted-foreground">Patient: {app.patient?.name || "Patient"}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
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
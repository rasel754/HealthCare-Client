"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyAppointmentsService, changeAppointmentStatusService } from "@/src/services/appointment.services";
import { createPrescriptionService } from "@/src/services/prescription.services";
import { IAppointment } from "@/src/types/domain.types";
import { AppointmentStatus } from "@/src/types/auth.type";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { Calendar, Video, FileText, CheckCircle2, Clock, X, AlertCircle } from "lucide-react";

export default function DoctorAppointmentsPage() {
  const queryClient = useQueryClient();
  const [selectedPrescriptionAppointment, setSelectedPrescriptionAppointment] = useState<IAppointment | null>(null);
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [prescriptionMsg, setPrescriptionMsg] = useState<string | null>(null);

  const { data: appointmentsResponse, isLoading } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: () => getMyAppointmentsService(),
  });

  const appointments = (appointmentsResponse && "data" in appointmentsResponse ? appointmentsResponse.data : []) as IAppointment[];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) => changeAppointmentStatusService(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] }),
  });

  const prescriptionMutation = useMutation({
    mutationFn: createPrescriptionService,
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setPrescriptionMsg(res.message);
      } else {
        setPrescriptionMsg("Prescription issued successfully!");
        setTimeout(() => {
          setSelectedPrescriptionAppointment(null);
          setInstructions("");
          setFollowUpDate("");
          setPrescriptionMsg(null);
          queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
        }, 1200);
      }
    },
  });

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrescriptionAppointment) return;
    prescriptionMutation.mutate({
      appointmentId: selectedPrescriptionAppointment.id,
      instructions,
      followUpDate: followUpDate || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Consultation Appointments</h1>
        <p className="text-xs text-slate-500 mt-1">Manage appointment statuses, initiate video calls, and issue prescriptions</p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading patient bookings...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Patient Appointments</h3>
          <p className="text-xs text-slate-400">Assigned patient appointments will appear here.</p>
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
                    Payment: {app.paymentStatus}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg">{app.patient?.name || "Patient"}</h3>
                <p className="text-xs text-slate-500">Contact: {app.patient?.contactNumber || "N/A"} • Email: {app.patient?.email}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{app.schedule?.startDate} ({app.schedule?.startTime} - {app.schedule?.endTime})</span>
                  </div>
                </div>
              </div>

              {/* Doctor Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {app.status === AppointmentStatus.SCHEDULED && (
                  <Button
                    size="sm"
                    onClick={() => statusMutation.mutate({ id: app.id, status: AppointmentStatus.INPROGRESS })}
                    className="rounded-xl text-xs bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Start Session
                  </Button>
                )}

                {app.status === AppointmentStatus.INPROGRESS && (
                  <Button
                    size="sm"
                    onClick={() => statusMutation.mutate({ id: app.id, status: AppointmentStatus.COMPLETED })}
                    className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Mark Completed
                  </Button>
                )}

                {app.videoCallingId && (
                  <a
                    href={`https://meet.jit.si/${app.videoCallingId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Video className="h-4 w-4" /> Video Call
                  </a>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPrescriptionAppointment(app)}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <FileText className="h-4 w-4 text-primary" /> Issue Prescription
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Issue Modal */}
      {selectedPrescriptionAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Issue Prescription for {selectedPrescriptionAppointment.patient?.name}</h3>
              <button onClick={() => setSelectedPrescriptionAppointment(null)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {prescriptionMsg && (
              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700">{prescriptionMsg}</div>
            )}

            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Prescription Instructions & Medication Dosage</label>
                <Textarea
                  placeholder="e.g. Tab Paracetamol 500mg 1+0+1 after meal for 5 days..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="rounded-xl"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Follow-Up Date (Optional)</label>
                <Input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <Button type="submit" disabled={prescriptionMutation.isPending} className="w-full rounded-xl">
                {prescriptionMutation.isPending ? "Issuing..." : "Submit Digital Prescription"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyPrescriptionsService, deletePrescriptionService } from "@/src/services/prescription.services";
import { IPrescription } from "@/src/types/domain.types";
import { FileText, Trash2, Calendar, User } from "lucide-react";

export default function DoctorPrescriptionsPage() {
  const queryClient = useQueryClient();
  const { data: prescriptionsResponse, isLoading } = useQuery({
    queryKey: ["doctor-prescriptions"],
    queryFn: () => getMyPrescriptionsService(),
  });

  const prescriptions = (prescriptionsResponse && "data" in prescriptionsResponse ? prescriptionsResponse.data : []) as IPrescription[];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePrescriptionService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-prescriptions"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Issued Prescriptions History</h1>
        <p className="text-xs text-slate-500 mt-1">Review digital prescriptions provided during patient consultations</p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading issued prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <FileText className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Prescriptions Created</h3>
          <p className="text-xs text-slate-400">Prescriptions created for completed appointments will be listed here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{p.patient?.name || "Patient"}</h3>
                    <p className="text-xs text-slate-400">{p.patient?.email}</p>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(p.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-1 text-xs">
                  <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Instructions</p>
                  <p className="text-slate-800 whitespace-pre-wrap">{p.instructions}</p>
                </div>
              </div>

              {p.followUpDate && (
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span>Follow-Up Date: <strong className="text-slate-800">{p.followUpDate}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPrescriptionsService } from "@/src/services/prescription.services";
import { IPrescription } from "@/src/types/domain.types";
import { Input } from "@/src/components/ui/input";
import { FileText, Search, Calendar, User, Stethoscope } from "lucide-react";

export default function PrescriptionsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: prescriptionsResponse, isLoading } = useQuery({
    queryKey: ["all-prescriptions", searchTerm],
    queryFn: () => getAllPrescriptionsService({ searchTerm: searchTerm || undefined, limit: 50 }),
  });

  const prescriptions = (prescriptionsResponse && "data" in prescriptionsResponse ? prescriptionsResponse.data : []) as IPrescription[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Prescriptions Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Audit digital prescriptions issued across consultations</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by doctor or patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-background text-foreground border-input"
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">Loading system prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Prescriptions Recorded</h3>
          <p className="text-xs text-muted-foreground">Digital prescriptions issued by doctors will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((p) => (
            <div key={p.id} className="bg-card text-card-foreground rounded-3xl border border-border p-6 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">Doctor: {p.doctor?.name || "Dr. Assigned"}</h3>
                      <p className="text-[11px] text-muted-foreground">Patient: {p.patient?.name || "Patient"}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-accent text-accent-foreground">
                    ID: {p.id.slice(0, 8)}
                  </span>
                </div>

                <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-1 text-xs">
                  <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Instructions & Medication</p>
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">{p.instructions}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Follow-Up: <strong className="text-foreground">{p.followUpDate || "None"}</strong></span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
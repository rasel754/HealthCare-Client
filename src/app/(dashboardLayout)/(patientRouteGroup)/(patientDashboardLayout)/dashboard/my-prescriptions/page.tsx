"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyPrescriptionsService } from "@/src/services/prescription.services";
import { IPrescription } from "@/src/types/domain.types";
import { FileText, Calendar, User, Clock, Download } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function MyPrescriptionsPage() {
  const { data: prescriptionsResponse, isLoading } = useQuery({
    queryKey: ["my-prescriptions"],
    queryFn: () => getMyPrescriptionsService(),
  });

  const prescriptions = (prescriptionsResponse && "data" in prescriptionsResponse ? prescriptionsResponse.data : []) as IPrescription[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Prescriptions</h1>
        <p className="text-xs text-muted-foreground mt-1">Digital prescriptions issued by your consulting specialist doctors</p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-muted-foreground">Loading prescriptions...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Prescriptions Issued</h3>
          <p className="text-xs text-muted-foreground">Your completed consultations will show issued prescription records here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((p) => (
            <div key={p.id} className="bg-card text-card-foreground rounded-3xl border border-border p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-bold text-foreground text-base">{p.doctor?.name || "Dr. Specialist"}</h3>
                  <p className="text-xs text-primary font-semibold">{p.doctor?.designation}</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <FileText className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-2 text-xs">
                <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Instructions & Dosage</p>
                <p className="text-foreground font-medium whitespace-pre-wrap leading-relaxed">{p.instructions}</p>
              </div>

              {p.followUpDate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Follow-Up Date: <strong className="text-foreground">{p.followUpDate}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
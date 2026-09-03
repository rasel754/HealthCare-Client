"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatientsService } from "@/src/services/patient.services";
import { changeUserStatusService } from "@/src/services/admin.services";
import { IPatient } from "@/src/types/domain.types";
import { UserStatus } from "@/src/types/auth.type";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Users, Search, ShieldAlert, CheckCircle, Ban, Mail, Phone, MapPin } from "lucide-react";
import { ClinicalCardGridSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function PatientsManagementPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const { data: patientsResponse, isLoading } = useQuery({
    queryKey: ["patients", searchTerm],
    queryFn: () => getPatientsService({ searchTerm: searchTerm || undefined, limit: 50 }),
  });


  const patients = (patientsResponse && "data" in patientsResponse ? patientsResponse.data : []) as IPatient[];

  const changeStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      changeUserStatusService(userId, status),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("Patient account status updated!");
        setTimeout(() => setMsg(null), 1500);
        queryClient.invalidateQueries({ queryKey: ["patients"] });
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Patients Directory Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Supervise registered patients and update account status</p>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patient name, email, or contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-background text-foreground border-input"
        />
      </div>

      {isLoading ? (
        <ClinicalCardGridSkeleton count={6} message="Loading patients directory..." />
      ) : patients.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <Users className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Patients Found</h3>
          <p className="text-xs text-muted-foreground">Registered patients will appear here once onboarded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => {
            const status = patient.status || UserStatus.ACTIVE;
            const isBlocked = status === UserStatus.BLOCKED;

            return (
              <div
                key={patient.id}
                className="bg-card text-card-foreground rounded-3xl border border-border p-6 flex flex-col justify-between shadow-xs space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xl uppercase">
                        {patient.name ? patient.name[0] : "P"}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-base">{patient.name}</h3>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mt-0.5 ${
                            isBlocked ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/40 border border-border p-3.5 rounded-2xl space-y-1.5 text-xs text-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    {patient.contactNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{patient.contactNumber}</span>
                      </div>
                    )}
                    {patient.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{patient.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                  {isBlocked ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        changeStatusMutation.mutate({ userId: patient.id, status: UserStatus.ACTIVE })
                      }
                      disabled={changeStatusMutation.isPending}
                      className="rounded-xl text-xs gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Unblock Patient
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        changeStatusMutation.mutate({ userId: patient.id, status: UserStatus.BLOCKED })
                      }
                      disabled={changeStatusMutation.isPending}
                      className="rounded-xl text-xs gap-1 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                    >
                      <Ban className="h-3.5 w-3.5" /> Block Patient
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
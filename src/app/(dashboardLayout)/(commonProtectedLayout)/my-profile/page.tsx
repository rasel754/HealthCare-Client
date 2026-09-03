"use client";

import { useQuery } from "@tanstack/react-query";
import { getMeService } from "@/src/services/auth.services";
import { IUser } from "@/src/types/auth.type";
import { User, Mail, Shield, Phone, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { ClinicalProfileSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function MyProfilePage() {
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMeService(),
  });

  const user = (userResponse && "data" in userResponse ? userResponse.data : null) as IUser | null;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Profile</h1>
          <p className="text-xs text-muted-foreground mt-1">Authenticated user credentials and system account status</p>
        </div>
        <ClinicalProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Profile</h1>
        <p className="text-xs text-muted-foreground mt-1">Authenticated user credentials and system account status</p>
      </div>

      <div className="bg-card text-card-foreground rounded-3xl border border-border p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-5 border-b border-border pb-6">
          <div className="h-20 w-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl shadow-lg shadow-primary/20">
            {user?.name ? user.name[0] : "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-primary/10 text-primary text-xs font-extrabold px-3 py-0.5 rounded-full uppercase">
                {user?.role}
              </span>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-0.5 rounded-full uppercase border border-emerald-500/30">
                {user?.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-foreground">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-bold uppercase">Email Address</p>
            <div className="flex items-center gap-2 font-semibold">
              <Mail className="h-4 w-4 text-primary" />
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-bold uppercase">Contact Number</p>
            <div className="flex items-center gap-2 font-semibold">
              <Phone className="h-4 w-4 text-primary" />
              <span>{user?.contactNumber || "Not provided"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-bold uppercase">Address</p>
            <div className="flex items-center gap-2 font-semibold">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{user?.address || "Not provided"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-bold uppercase">Email Verification</p>
            <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>{user?.emailVerified ? "Verified" : "Pending Verification"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
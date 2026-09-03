"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMeService, logoutService } from "@/src/services/auth.services";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

import MedicalLoader from "./MedicalLoader";

export default function DashboardContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMeService(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const user = userResponse && "data" in userResponse ? userResponse.data : null;

  useEffect(() => {
    if (!isLoading && userResponse && "success" in userResponse && !userResponse.success) {
      router.replace("/login");
    }
  }, [isLoading, userResponse, router]);


  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });

  if (isLoading) {
    return (
      <MedicalLoader
        variant="fullscreen"
        title="Loading HealthCare Dashboard..."
        subtitle="Verifying medical credentials and synchronizing clinical telemetry"
        icon="stethoscope"
        showECG={true}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors">
      <DashboardSidebar user={user} onLogout={() => logoutMutation.mutate()} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

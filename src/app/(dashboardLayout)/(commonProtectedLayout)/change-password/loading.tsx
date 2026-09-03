import { ClinicalSkeleton } from "@/src/components/shared/ClinicalSkeleton";
import { Lock } from "lucide-react";

export default function ChangePasswordLoading() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Lock className="h-5 w-5 animate-heart-pulse" />
        </div>
        <div className="space-y-1">
          <ClinicalSkeleton height="20px" width="160px" rounded="md" />
          <ClinicalSkeleton height="12px" width="220px" rounded="md" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
        <ClinicalSkeleton height="40px" width="100%" rounded="xl" />
        <ClinicalSkeleton height="40px" width="100%" rounded="xl" />
        <ClinicalSkeleton height="40px" width="100%" rounded="xl" />
        <ClinicalSkeleton height="44px" width="100%" rounded="xl" />
      </div>
    </div>
  );
}
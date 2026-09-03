import { ClinicalTableSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function MyPrescriptionsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Prescriptions</h1>
          <p className="text-xs text-muted-foreground mt-1">Medical prescriptions issued by clinical specialists</p>
        </div>
      </div>
      <ClinicalTableSkeleton rows={4} columns={5} message="Loading your active prescriptions..." />
    </div>
  );
}
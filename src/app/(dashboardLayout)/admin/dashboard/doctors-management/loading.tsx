import { ClinicalTableSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function DoctorsManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctors Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage clinical practitioners, specialties, and profiles</p>
        </div>
      </div>
      <ClinicalTableSkeleton rows={6} columns={6} message="Retrieving registered medical doctors..." />
    </div>
  );
}

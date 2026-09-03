import { ClinicalTableSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function PatientsManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patients Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Directory of registered patients, health records, and account statuses</p>
        </div>
      </div>
      <ClinicalTableSkeleton rows={5} columns={5} message="Loading patient health records..." />
    </div>
  );
}

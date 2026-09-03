import { ClinicalTableSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function DoctorSchedulesManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Schedules Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Assign doctor shifts and manage active consultation schedules</p>
        </div>
      </div>
      <ClinicalTableSkeleton rows={5} columns={6} message="Loading doctor schedule assignments..." />
    </div>
  );
}

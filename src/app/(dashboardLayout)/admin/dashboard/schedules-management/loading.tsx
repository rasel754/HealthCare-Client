import { ClinicalTableSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function SchedulesManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Schedules Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Configure global consultation time slots and availability</p>
        </div>
      </div>
      <ClinicalTableSkeleton rows={6} columns={6} message="Loading consultation schedule slots..." />
    </div>
  );
}

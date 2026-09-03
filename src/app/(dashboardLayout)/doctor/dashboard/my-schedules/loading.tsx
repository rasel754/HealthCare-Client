import { ClinicalTableSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function DoctorSchedulesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Schedules</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage consultation availability and assigned shift time slots</p>
        </div>
      </div>
      <ClinicalTableSkeleton rows={5} columns={5} message="Loading doctor consultation schedules..." />
    </div>
  );
}
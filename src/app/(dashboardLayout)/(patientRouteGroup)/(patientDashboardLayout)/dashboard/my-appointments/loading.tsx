import { ClinicalTableSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function MyAppointmentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Appointments</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage consultation bookings, join video meetings, and process consultation fees</p>
        </div>
      </div>
      <ClinicalTableSkeleton rows={5} columns={6} message="Retrieving consultation bookings..." />
    </div>
  );
}
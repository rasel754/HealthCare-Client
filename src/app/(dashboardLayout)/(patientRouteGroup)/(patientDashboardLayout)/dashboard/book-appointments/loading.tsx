import { ClinicalCardGridSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function BookAppointmentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Book Clinical Consultation</h1>
          <p className="text-xs text-muted-foreground mt-1">Search certified medical specialists and reserve available appointment slots</p>
        </div>
      </div>
      <ClinicalCardGridSkeleton count={6} message="Searching available clinical specialists..." />
    </div>
  );
}
import { ClinicalProfileSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function PatientHealthRecordLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patient Health Record</h1>
          <p className="text-xs text-muted-foreground mt-1">Personal medical history, vital telemetry, and clinical diagnoses</p>
        </div>
      </div>
      <ClinicalProfileSkeleton />
    </div>
  );
}
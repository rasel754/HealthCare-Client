import { ClinicalTableSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function DoctorSpecialtiesManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Specialties Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Assign clinical specialties and sub-disciplines to practitioners</p>
        </div>
      </div>
      <ClinicalTableSkeleton rows={5} columns={5} message="Loading doctor specialty linkages..." />
    </div>
  );
}

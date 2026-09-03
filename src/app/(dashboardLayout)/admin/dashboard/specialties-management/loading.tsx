import { ClinicalCardGridSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function SpecialtiesManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Specialties Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Configure clinical specialty categories and medical icons</p>
        </div>
      </div>
      <ClinicalCardGridSkeleton count={6} message="Loading clinical specialties..." />
    </div>
  );
}

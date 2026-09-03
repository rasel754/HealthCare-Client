import { ClinicalCardGridSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function DoctorReviewsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Patient Reviews</h1>
          <p className="text-xs text-muted-foreground mt-1">Patient ratings, clinical testimonials, and feedback</p>
        </div>
      </div>
      <ClinicalCardGridSkeleton count={4} message="Loading patient ratings & clinical reviews..." />
    </div>
  );
}
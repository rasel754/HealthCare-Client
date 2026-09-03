import { ClinicalProfileSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function MyProfileLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
        <p className="text-xs text-muted-foreground mt-1">Manage your account information and preferences</p>
      </div>
      <ClinicalProfileSkeleton />
    </div>
  );
}
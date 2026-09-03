import { ClinicalTableSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function PaymentsManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Payments Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Transaction logs, invoice statuses, and consultation revenue</p>
        </div>
      </div>
      <ClinicalTableSkeleton rows={5} columns={6} message="Retrieving financial transaction logs..." />
    </div>
  );
}

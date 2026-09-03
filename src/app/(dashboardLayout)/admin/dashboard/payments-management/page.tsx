"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPaymentsService } from "@/src/services/admin.services";
import { IPayment } from "@/src/types/domain.types";
import { PaymentStatus } from "@/src/types/auth.type";
import { Input } from "@/src/components/ui/input";
import { DollarSign, Search, CreditCard, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { ClinicalCardGridSkeleton } from "@/src/components/shared/ClinicalSkeleton";

export default function PaymentsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: paymentsResponse, isLoading } = useQuery({
    queryKey: ["admin-payments", searchTerm],
    queryFn: () => getPaymentsService({ searchTerm: searchTerm || undefined, limit: 50 }),
  });


  const payments = (paymentsResponse && "data" in paymentsResponse ? paymentsResponse.data : []) as IPayment[];

  const totalCollected = payments.reduce((acc, p) => (p.status === PaymentStatus.PAID ? acc + (p.amount || 0) : acc), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Payments & Financial Transactions</h1>
          <p className="text-xs text-muted-foreground mt-1">Audit appointment payment records and gateway transactions</p>
        </div>

        <div className="bg-card text-card-foreground px-5 py-3 rounded-2xl border border-border shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Collected</p>
            <p className="text-xl font-extrabold text-foreground">${totalCollected.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by transaction ID or patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-background text-foreground border-input"
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">Loading payment transactions...</div>
      ) : payments.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Payments Recorded</h3>
          <p className="text-xs text-muted-foreground">Transaction records will automatically appear when patients settle appointments.</p>
        </div>
      ) : (
        <div className="bg-card text-card-foreground rounded-3xl border border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-accent/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium text-foreground">
                {payments.map((p) => {
                  const isPaid = p.status === PaymentStatus.PAID;
                  return (
                    <tr key={p.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-foreground">{p.transactionId || p.id}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{p.appointment?.patient?.name || "Patient"}</td>
                      <td className="px-6 py-4 font-extrabold text-foreground">${p.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isPaid ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {isPaid ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
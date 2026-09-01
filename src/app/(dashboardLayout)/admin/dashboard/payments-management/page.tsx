"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPaymentsService } from "@/src/services/admin.services";
import { IPayment } from "@/src/types/domain.types";
import { PaymentStatus } from "@/src/types/auth.type";
import { Input } from "@/src/components/ui/input";
import { DollarSign, Search, CreditCard, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments & Financial Transactions</h1>
          <p className="text-xs text-slate-500 mt-1">Audit appointment payment records and gateway transactions</p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Collected</p>
            <p className="text-xl font-extrabold text-slate-900">${totalCollected.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by transaction ID or patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-white"
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading payment transactions...</div>
      ) : payments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <CreditCard className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Payments Recorded</h3>
          <p className="text-xs text-slate-400">Transaction records will automatically appear when patients settle appointments.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {payments.map((p) => {
                  const isPaid = p.status === PaymentStatus.PAID;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{p.transactionId || p.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{p.appointment?.patient?.name || "Patient"}</td>
                      <td className="px-6 py-4 font-extrabold text-slate-900">${p.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isPaid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isPaid ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
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
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { CheckCircle2, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId") || searchParams.get("session_id");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard/my-appointments?payment=success&status=PAID");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);


  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-6">
        <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-bold animate-in zoom-in duration-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> Transaction Complete
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Appointment Payment Successful!
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Your appointment has been confirmed and registered with the specialist doctor.
          </p>
        </div>

        {transactionId && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1 font-mono">
            <p className="text-slate-400 uppercase font-bold text-[10px]">Reference / Transaction ID</p>
            <p className="font-extrabold text-slate-900 truncate">{transactionId}</p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard/my-appointments" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 font-semibold gap-2">
              <Calendar className="h-5 w-5" /> View My Appointments <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-6 font-semibold">
              Return to Patient Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-slate-500">Loading payment status...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
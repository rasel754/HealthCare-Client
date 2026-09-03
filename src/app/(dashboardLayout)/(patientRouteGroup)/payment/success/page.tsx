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
      <div className="bg-card text-card-foreground rounded-3xl border border-border p-8 sm:p-12 shadow-xl space-y-6">
        <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto font-bold animate-in zoom-in duration-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> Transaction Complete
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Appointment Payment Successful!
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Your appointment has been confirmed and registered with the specialist doctor.
          </p>
        </div>

        {transactionId && (
          <div className="bg-muted/40 p-4 rounded-2xl border border-border text-xs text-muted-foreground space-y-1 font-mono">
            <p className="text-muted-foreground/70 uppercase font-bold text-[10px]">Reference / Transaction ID</p>
            <p className="font-extrabold text-foreground truncate">{transactionId}</p>
          </div>
        )}

        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard/my-appointments" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 font-semibold gap-2 shadow-sm">
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
    <Suspense fallback={<div className="py-12 text-center text-xs text-muted-foreground">Loading payment status...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
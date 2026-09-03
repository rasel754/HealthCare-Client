"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentSuccessRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const target = params
      ? `/dashboard/my-appointments?payment=success&status=PAID&${params}`
      : `/dashboard/my-appointments?payment=success&status=PAID`;
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="py-24 text-center space-y-3">
      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-sm font-semibold text-muted-foreground">Payment Successful! Redirecting to My Appointments...</p>
    </div>
  );
}

export default function DashboardPaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-muted-foreground">Redirecting to My Appointments...</div>}>
      <PaymentSuccessRedirect />
    </Suspense>
  );
}

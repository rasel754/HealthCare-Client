import VerifyEmailForm from "@/src/components/modules/auth/VerifyEmailForm";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
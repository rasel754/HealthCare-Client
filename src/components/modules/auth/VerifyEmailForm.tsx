"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { verifyEmailZodSchema, IVerifyEmailPayload } from "@/src/zod/auth.validation";
import { verifyEmailService } from "@/src/services/auth.services";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import AppField from "../../shared/form/AppField";
import AppSubmitButton from "../../shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "../../ui/alert";
import { ShieldCheck, Mail, KeyRound, CheckCircle2 } from "lucide-react";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultEmail = searchParams.get("email") || "";

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IVerifyEmailPayload) => verifyEmailService(payload),
  });

  const form = useForm({
    defaultValues: {
      email: defaultEmail,
      otp: "",
    } as IVerifyEmailPayload,
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMsg(null);
      try {
        const res = (await mutateAsync(value)) as any;
        if (res && "success" in res && !res.success) {
          setServerError(res.message || "Verification failed");
        } else {
          setSuccessMsg("Email verified successfully! Redirecting to login...");
          setTimeout(() => router.push("/login"), 1200);
        }
      } catch (err: any) {
        console.error("Email verification error:", err);
        setServerError(err.message || "Verification failed");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-border bg-card text-card-foreground">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Verify Your Email</CardTitle>
        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
          Enter the verification code sent to your registered email
        </CardDescription>
      </CardHeader>

      <CardContent>
        {serverError && (
          <Alert variant="destructive" className="mb-4 py-2.5">
            <AlertDescription className="text-xs">{serverError}</AlertDescription>
          </Alert>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: verifyEmailZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email Address"
                type="email"
                placeholder="patient@example.com"
                prepend={<Mail className="h-4 w-4" />}
                required
              />
            )}
          </form.Field>

          <form.Field
            name="otp"
            validators={{ onChange: verifyEmailZodSchema.shape.otp }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Verification Code (OTP)"
                placeholder="123456"
                prepend={<KeyRound className="h-4 w-4" />}
                inputClassName="tracking-widest font-mono text-base"
                required
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Verifying..."
                disabled={!canSubmit}
                className="mt-2"
              >
                Verify Email
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Need to sign in with a different account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline underline-offset-4 ml-1"
          >
            Back to Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}


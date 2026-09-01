"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { forgetPasswordZodSchema, IForgetPasswordPayload } from "@/src/zod/auth.validation";
import { forgetPasswordService } from "@/src/services/auth.services";
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
import { KeyRound, Mail, CheckCircle2 } from "lucide-react";

export default function ForgetPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IForgetPasswordPayload) => forgetPasswordService(payload),
  });

  const form = useForm({
    defaultValues: {
      email: "",
    } as IForgetPasswordPayload,
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMsg(null);
      try {
        const res = (await mutateAsync(value)) as any;
        if (res && "success" in res && !res.success) {
          setServerError(res.message || "Failed to send reset email");
        } else {
          setSuccessMsg("Password reset OTP sent to your email!");
          setTimeout(() => {
            router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
          }, 1200);
        }
      } catch (err: any) {
        console.error("Forget password error:", err);
        setServerError(err.message || "Failed to send reset email");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-border bg-card text-card-foreground">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
          <KeyRound className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password</CardTitle>
        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
          Enter your registered email to receive a password reset OTP
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
            validators={{ onChange: forgetPasswordZodSchema.shape.email }}
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

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Sending OTP..."
                disabled={!canSubmit}
                className="mt-2"
              >
                Send Reset Code
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Remembered your password?{" "}
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


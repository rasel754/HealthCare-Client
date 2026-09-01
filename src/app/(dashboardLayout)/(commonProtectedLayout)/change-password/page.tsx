"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { changePasswordZodSchema, IChangePasswordPayload } from "@/src/zod/auth.validation";
import { changePasswordService } from "@/src/services/auth.services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import AppField from "@/src/components/shared/form/AppField";
import AppSubmitButton from "@/src/components/shared/form/AppSubmitButton";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Lock, Eye, EyeOff, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ChangePasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IChangePasswordPayload) => changePasswordService(payload),
  });

  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    } as IChangePasswordPayload,
    onSubmit: async ({ value, formApi }) => {
      setServerError(null);
      setSuccessMsg(null);
      try {
        const res = (await mutateAsync(value)) as any;
        if (res && "success" in res && !res.success) {
          setServerError(res.message || "Failed to change password");
        } else {
          setSuccessMsg("Password changed successfully!");
          formApi.reset();
        }
      } catch (err: any) {
        console.error("Change password error:", err);
        setServerError(err.message || "Failed to change password");
      }
    },
  });

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Change Password</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Update your account credentials to keep your account secure
        </p>
      </div>

      <Card className="shadow-lg border border-border bg-card text-card-foreground">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Security Credentials</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Enter your current and new password
              </CardDescription>
            </div>
          </div>
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
              name="oldPassword"
              validators={{ onChange: changePasswordZodSchema.shape.oldPassword }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Current Password"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="••••••••"
                  prepend={<Lock className="h-4 w-4" />}
                  required
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowOldPassword((prev) => !prev)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label={showOldPassword ? "Hide password" : "Show password"}
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            <form.Field
              name="newPassword"
              validators={{ onChange: changePasswordZodSchema.shape.newPassword }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  prepend={<Lock className="h-4 w-4" />}
                  helperText="Password must be at least 6 characters long."
                  required
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Updating Password..."
                  disabled={!canSubmit}
                  className="mt-2"
                >
                  Update Password
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
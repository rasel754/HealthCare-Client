"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { registerZodSchema, IRegisterPayload } from "@/src/zod/auth.validation";
import { registerPatientService } from "@/src/services/auth.services";
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
import { Button } from "../../ui/button";
import { Alert, AlertDescription } from "../../ui/alert";
import {
  Activity,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerPatientService(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
    } as IRegisterPayload,
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMsg(null);
      try {
        const res = (await mutateAsync(value)) as any;
        if (res && "success" in res && !res.success) {
          setServerError(res.message || "Registration failed");
        } else {
          setSuccessMsg("Registration successful! Redirecting to verify email...");
          setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(value.email)}`);
          }, 1200);
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        setServerError(err.message || "Registration failed");
      }
    },
  });

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border border-border bg-card text-card-foreground">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
          <Activity className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create Patient Account</CardTitle>
        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
          Join HealthCare to book appointments and manage your health records
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
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Full Name"
                placeholder="John Doe"
                prepend={<User className="h-4 w-4" />}
                required
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="password"
              validators={{ onChange: registerZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  prepend={<Lock className="h-4 w-4" />}
                  required
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
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
              name="contactNumber"
              validators={{ onChange: registerZodSchema.shape.contactNumber }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Contact Number"
                  type="tel"
                  placeholder="+8801700000000"
                  prepend={<Phone className="h-4 w-4" />}
                  required
                />
              )}
            </form.Field>
          </div>

          <form.Field
            name="address"
            validators={{ onChange: registerZodSchema.shape.address }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Address (Optional)"
                placeholder="123 Health Ave, City"
                prepend={<MapPin className="h-4 w-4" />}
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Creating Account..."
                disabled={!canSubmit}
                className="mt-2"
              >
                Create Account
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline underline-offset-4 ml-1"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}


"use client";

import { loginAction } from "@/src/app/(commonLayout)/login/_actions";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  HeartPulse,
  Loader2,
  User,
  Stethoscope,
  ShieldCheck,
  Crown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import AppField from "../../shared/form/AppField";
import { Button } from "../../ui/button";
import { Alert, AlertDescription } from "../../ui/alert";
import AppSubmitButton from "../../shared/form/AppSubmitButton";
import { cn } from "@/src/lib/utils";

interface LoginFormProps {
  redirectPath?: string;
}

const DEMO_ACCOUNTS = [
  {
    role: "User",
    label: "User",
    badge: "Patient",
    email: "user.demo@gmail.com",
    password: "Password123",
    icon: User,
    color: "text-blue-500 dark:text-blue-400",
    bgHover: "hover:border-blue-500/50 hover:bg-blue-500/5",
    activeClass: "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30",
  },
  {
    role: "Doctor",
    label: "Doctor",
    badge: "Doctor",
    email: "doctor.demo@gmail.com",
    password: "Password123",
    icon: Stethoscope,
    color: "text-emerald-500 dark:text-emerald-400",
    bgHover: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
    activeClass: "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30",
  },
  {
    role: "Admin",
    label: "Admin",
    badge: "Admin",
    email: "admin.demo@gmail.com",
    password: "Password123",
    icon: ShieldCheck,
    color: "text-amber-500 dark:text-amber-400",
    bgHover: "hover:border-amber-500/50 hover:bg-amber-500/5",
    activeClass: "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30",
  },
  {
    role: "Superadmin",
    label: "Super Admin",
    badge: "Super Admin",
    email: "superadmin.demo@gmail.com",
    password: "Password123",
    icon: Crown,
    color: "text-purple-500 dark:text-purple-400",
    bgHover: "hover:border-purple-500/50 hover:bg-purple-500/5",
    activeClass: "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/30",
  },
];

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<string | null>(null);

  const oauthError = useMemo(() => {
    const error = searchParams.get("error");
    if (!error) return null;
    switch (error) {
      case "patient_only":
        return "Google sign-in is exclusively available for Patient accounts. Doctors and Admins must sign in using their email and password credentials.";
      case "oauth_failed":
        return "Google sign-in was cancelled or failed. Please try again.";
      case "no_session_found":
        return "Unable to verify Google session. Please try logging in again.";
      case "no_user_found":
        return "No user account linked to this Google profile.";
      default:
        return `Authentication error: ${error}`;
    }
  }, [searchParams]);

  const effectiveRedirectPath = useMemo(() => {
    return redirectPath || searchParams.get("redirect") || "/dashboard";
  }, [redirectPath, searchParams]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, effectiveRedirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);
        if (result && result.success && result.data?.user) {
          queryClient.setQueryData(["me"], {
            statusCode: 200,
            success: true,
            message: "User retrieved successfully",
            data: result.data.user,
          });
          queryClient.invalidateQueries({ queryKey: ["me"] });
          const target = result.targetPath || "/dashboard";
          router.push(target);
          router.refresh();
        } else if (result?.needEmailVerify) {
          router.push(`/verify-email?email=${encodeURIComponent(result.email || value.email)}`);
        } else {
          setServerError(result?.message || "Login failed");
        }
      } catch (error: any) {
        console.error(`Login failed:`, error);
        setServerError(error.message || "Login failed");
      }
    },
  });

  const handleFillDemo = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    form.setFieldValue("email", account.email);
    form.setFieldValue("password", account.password);
    setSelectedDemoRole(account.role);
    setServerError(null);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    // Google sign-in is for Patients only; prevent redirecting patients into doctor/admin dashboards
    let target = effectiveRedirectPath;
    if (target.startsWith("/doctor") || target.startsWith("/admin")) {
      target = "/dashboard";
    }
    window.location.href = `${baseUrl}/auth/login/google?redirect=${encodeURIComponent(target)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-border bg-card text-card-foreground">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
          <HeartPulse className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
          Please enter your credentials to log in to your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Recruiter / Quick Demo Logins */}
        <div className="mb-5 p-3 rounded-xl border border-primary/20 bg-primary/[0.03] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Demo Logins</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium bg-background px-1.5 py-0.5 rounded border border-border">
              Click to autofill
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => {
              const Icon = acc.icon;
              const isSelected = selectedDemoRole === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleFillDemo(acc)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border text-left transition-all duration-150 cursor-pointer bg-card/80 shadow-xs",
                    acc.bgHover,
                    isSelected
                      ? acc.activeClass
                      : "border-border text-foreground/80 hover:text-foreground hover:border-border/80"
                  )}
                  title={`Click to fill ${acc.label} credentials`}
                >
                  <div className={cn("p-1.5 rounded-md bg-muted/70 shrink-0", acc.color)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate leading-tight text-foreground">{acc.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate leading-tight">{acc.badge}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {oauthError && (
          <Alert variant="destructive" className="mb-4 py-2.5">
            <AlertDescription className="text-xs">{oauthError}</AlertDescription>
          </Alert>
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
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                prepend={<Mail className="h-4 w-4" />}
                required
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
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

          <div className="flex justify-end">
            <Link
              href="/forget-password"
              className="text-xs text-primary font-medium hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          {serverError && (
            <Alert variant="destructive" className="py-2.5">
              <AlertDescription className="text-xs">{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Logging In..."
                disabled={!canSubmit || isGoogleLoading}
                className="mt-2"
              >
                Log In
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="px-2 bg-card text-muted-foreground font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isPending || isGoogleLoading}
          className="w-full border-border hover:bg-muted/80 text-foreground cursor-pointer transition-all duration-200 flex items-center justify-center gap-2.5 h-10 shadow-xs"
          onClick={handleGoogleSignIn}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google (Patient)</span>
            </>
          )}
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Google sign-in is reserved for patients. Doctors &amp; Admins please use credentials.
        </p>
      </CardContent>

      <CardFooter className="justify-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-semibold hover:underline underline-offset-4 ml-1"
          >
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
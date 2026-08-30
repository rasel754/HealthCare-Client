"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailZodSchema, IVerifyEmailPayload } from "@/src/zod/auth.validation";
import { verifyEmailService } from "@/src/services/auth.services";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ShieldCheck, Mail, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultEmail = searchParams.get("email") || "";

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IVerifyEmailPayload>({
    resolver: zodResolver(verifyEmailZodSchema),
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = async (data: IVerifyEmailPayload) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await verifyEmailService(data);
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg("Email verified successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verify Your Email</h2>
        <p className="text-sm text-slate-500 mt-1">Enter the OTP sent to your registered email</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input id="email" type="email" placeholder="patient@example.com" className="pl-9" {...register("email")} />
          </div>
          {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="otp">Verification Code (OTP)</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input id="otp" placeholder="123456" className="pl-9 tracking-widest text-lg" {...register("otp")} />
          </div>
          {errors.otp && <p className="text-xs text-rose-600 mt-1">{errors.otp.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-xl mt-2">
          {loading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>
    </div>
  );
}

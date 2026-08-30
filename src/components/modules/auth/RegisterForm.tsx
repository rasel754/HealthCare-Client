"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerZodSchema, IRegisterPayload } from "@/src/zod/auth.validation";
import { registerPatientService } from "@/src/services/auth.services";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Activity, Lock, Mail, User, Phone, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterPayload>({
    resolver: zodResolver(registerZodSchema),
  });

  const onSubmit = async (data: IRegisterPayload) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await registerPatientService(data);
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg("Registration successful! Redirecting to verify email...");
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
          <Activity className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Patient Account</h2>
        <p className="text-sm text-slate-500 mt-1">Join HealthCare to book appointments & manage health records</p>
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
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input id="name" placeholder="John Doe" className="pl-9" {...register("name")} />
          </div>
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input id="email" type="email" placeholder="patient@example.com" className="pl-9" {...register("email")} />
          </div>
          {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-9" {...register("password")} />
            </div>
            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input id="contactNumber" placeholder="+8801700000000" className="pl-9" {...register("contactNumber")} />
            </div>
            {errors.contactNumber && <p className="text-xs text-rose-600 mt-1">{errors.contactNumber.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address (Optional)</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input id="address" placeholder="123 Health Ave, City" className="pl-9" {...register("address")} />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-xl mt-2">
          {loading ? "Registering..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-6">
        Already registered?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

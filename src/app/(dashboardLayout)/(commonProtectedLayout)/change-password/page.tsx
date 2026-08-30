"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordZodSchema, IChangePasswordPayload } from "@/src/zod/auth.validation";
import { changePasswordService } from "@/src/services/auth.services";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ChangePasswordPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IChangePasswordPayload>({
    resolver: zodResolver(changePasswordZodSchema),
  });

  const onSubmit = async (data: IChangePasswordPayload) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await changePasswordService(data);
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg("Password changed successfully!");
        reset();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Change Password</h1>
        <p className="text-xs text-slate-500 mt-1">Update your account security credentials</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-xs">
        <div className="space-y-1.5">
          <Label htmlFor="oldPassword">Current Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input id="oldPassword" type="password" placeholder="••••••••" className="pl-9" {...register("oldPassword")} />
          </div>
          {errors.oldPassword && <p className="text-xs text-rose-600 mt-1">{errors.oldPassword.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input id="newPassword" type="password" placeholder="••••••••" className="pl-9" {...register("newPassword")} />
          </div>
          {errors.newPassword && <p className="text-xs text-rose-600 mt-1">{errors.newPassword.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-xl mt-2 h-11 font-semibold">
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMeService } from "@/src/services/auth.services";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, LayoutDashboard, UserPlus, LogIn } from "lucide-react";
import { Role, IUser } from "@/src/types/auth.type";

export default function HeroAuthButtons() {
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMeService(),
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const user =
    userResponse && typeof userResponse === "object" && "data" in userResponse && userResponse.data
      ? (userResponse.data as IUser)
      : userResponse && typeof userResponse === "object" && "email" in userResponse
      ? (userResponse as unknown as IUser)
      : null;

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    const role = (user.role || "").toUpperCase();
    if (role === Role.SUPER_ADMIN || role === Role.ADMIN) return "/admin/dashboard";
    if (role === Role.DOCTOR) return "/doctor/dashboard";
    return "/dashboard";
  };

  const getDashboardLabel = () => {
    if (!user) return "Go to Dashboard";
    const role = (user.role || "").toUpperCase();
    if (role === Role.SUPER_ADMIN) return "Super Admin Dashboard";
    if (role === Role.ADMIN) return "Admin Dashboard";
    if (role === Role.DOCTOR) return "Doctor Dashboard";
    return "Patient Dashboard";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
        <Link href="/consultation">
          <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 h-12 text-base gap-2 shadow-lg shadow-primary/20">
            Find a Doctor Now <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <div className="h-12 w-48 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
      <Link href="/consultation">
        <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 h-12 text-base gap-2 shadow-lg shadow-primary/20">
          Find a Doctor Now <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>

      {user ? (
        <Link href={getDashboardPath()}>
          <Button
            size="lg"
            variant="default"
            className="w-full sm:w-auto rounded-xl px-8 h-12 text-base gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-lg shadow-primary/20 font-semibold"
          >
            <LayoutDashboard className="h-5 w-5" />
            {getDashboardLabel()}
          </Button>
        </Link>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-8 h-12 text-base gap-2 shadow-xs font-semibold">
              <UserPlus className="h-5 w-5 text-primary" />
              Patient Registration
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="ghost" className="w-full sm:w-auto rounded-xl px-6 h-12 text-base gap-2 font-semibold">
              <LogIn className="h-5 w-5" />
              Log In
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

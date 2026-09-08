"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { Role, IUser } from "@/src/types/auth.type";
import { ThemeToggle } from "@/src/components/shared/ThemeToggle";

interface DashboardHeaderProps {
  user: IUser | null;
  title?: string;
}

export default function DashboardHeader({ user, title = "Dashboard" }: DashboardHeaderProps) {
  const pathname = usePathname();
  const activeRole = user?.role || (
    pathname.startsWith("/admin") ? (user?.role === Role.SUPER_ADMIN ? Role.SUPER_ADMIN : Role.ADMIN) :
    pathname.startsWith("/doctor") ? Role.DOCTOR :
    Role.PATIENT
  );

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shadow-xs transition-colors">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-muted/50 border border-input text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Icon */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-card"></span>
        </button>

        {/* User Info Avatar */}
        <Link
          href="/my-profile"
          className="flex items-center gap-3 pl-2 border-l border-border hover:opacity-80 transition-opacity"
        >
          {user?.image || user?.profilePhoto || user?.patient?.profilePhoto || user?.doctor?.profilePhoto ? (
            <img
              src={user.image || user.profilePhoto || user.patient?.profilePhoto || user.doctor?.profilePhoto}
              alt={user.name || "User"}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {user?.name || user?.patient?.name || user?.doctor?.name
                ? (user?.name || user?.patient?.name || user?.doctor?.name)[0].toUpperCase()
                : <User className="h-4 w-4" />}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-foreground leading-tight">
              {user?.name || user?.patient?.name || user?.doctor?.name || user?.admin?.name || (activeRole === Role.SUPER_ADMIN ? "Super Admin" : activeRole === Role.ADMIN ? "Admin" : activeRole === Role.DOCTOR ? "Doctor" : "Patient")}
            </p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
              {user?.role || activeRole}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}


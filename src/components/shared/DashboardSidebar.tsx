"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  Calendar,
  Clock,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Star,
  Stethoscope,
  User,
  Users,
  Settings,
  Lock,
  PlusCircle,
} from "lucide-react";
import { Role, IUser } from "@/src/types/auth.type";

interface SidebarProps {
  user: IUser | null;
  onLogout: () => void;
}

export default function DashboardSidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const role = user?.role;

  const getRoleLinks = () => {
    if (role === Role.SUPER_ADMIN || role === Role.ADMIN) {
      return [
        { href: "/admin/dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
        { href: "/admin/dashboard/doctors-management", label: "Doctors Directory", icon: Stethoscope },
        { href: "/admin/dashboard/patients-management", label: "Patients Directory", icon: Users },
        { href: "/admin/dashboard/specialties-management", label: "Medical Specialties", icon: PlusCircle },
        { href: "/admin/dashboard/schedules-management", label: "Schedule Slots", icon: Clock },
        { href: "/admin/dashboard/appointments-management", label: "System Appointments", icon: Calendar },
        { href: "/admin/dashboard/prescriptions-management", label: "Prescriptions", icon: FileText },
        { href: "/admin/dashboard/payments-management", label: "Payments & Financials", icon: Settings },
        { href: "/admin/dashboard/reviews-management", label: "Reviews & Ratings", icon: Star },
        ...(role === Role.SUPER_ADMIN
          ? [{ href: "/admin/dashboard/admins-management", label: "Admins Management", icon: ShieldCheck }]
          : []),
      ];
    }

    if (role === Role.DOCTOR) {
      return [
        { href: "/doctor/dashboard", label: "Doctor Dashboard", icon: LayoutDashboard },
        { href: "/doctor/dashboard/appointments", label: "Patient Appointments", icon: Calendar },
        { href: "/doctor/dashboard/my-schedules", label: "My Schedule Slots", icon: Clock },
        { href: "/doctor/dashboard/prescriptions", label: "Issued Prescriptions", icon: FileText },
        { href: "/doctor/dashboard/my-reviews", label: "Patient Reviews", icon: Star },
      ];
    }

    // Default: PATIENT
    return [
      { href: "/dashboard", label: "Patient Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/my-appointments", label: "My Appointments", icon: Calendar },
      { href: "/dashboard/my-prescriptions", label: "My Prescriptions", icon: FileText },
      { href: "/dashboard/health-record", label: "Health Records & Profile", icon: User },
    ];
  };

  const roleLinks = getRoleLinks();

  const commonLinks = [
    { href: "/my-profile", label: "My Profile", icon: User },
    { href: "/change-password", label: "Change Password", icon: Lock },
    { href: "/", label: "Main Site", icon: Home },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen flex flex-col justify-between p-4 shadow-xs transition-colors">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span>Health<span className="text-foreground">Care</span></span>
        </Link>

        {/* User Badge */}
        <div className="bg-muted/50 border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg uppercase">
            {user?.name ? user.name[0] : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-sm text-foreground truncate">{user?.name || "User"}</p>
            <p className="text-xs text-primary font-medium uppercase tracking-wider">{user?.role || "PATIENT"}</p>
          </div>
        </div>

        {/* Navigation Group */}
        <nav className="space-y-1">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Main Menu</p>
          {roleLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-border">
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Account Settings</p>
            {commonLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors mt-6 cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout Account</span>
      </button>
    </aside>
  );
}

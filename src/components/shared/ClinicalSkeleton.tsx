"use client";

import React from "react";
import { Activity, Heart, Calendar, Stethoscope, ShieldCheck } from "lucide-react";
import { ECGWaveSVG } from "./MedicalLoader";

export interface ClinicalSkeletonProps {
  className?: string;
  rounded?: "default" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  height?: string;
  width?: string;
}

export const ClinicalSkeleton: React.FC<ClinicalSkeletonProps> = ({
  className = "",
  rounded = "xl",
  height,
  width,
}) => {
  const roundedClass = {
    default: "rounded",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      style={{ height, width }}
      className={`relative overflow-hidden bg-muted/60 ${roundedClass} ${className}`}
    >
      <div className="absolute inset-0 clinical-shimmer" />
    </div>
  );
};

export const ClinicalTableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  message?: string;
}> = ({ rows = 5, columns = 5, message = "Retrieving clinical records..." }) => {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Table Loading Indicator Bar */}
      <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center h-8 w-8 rounded-xl bg-primary/10 text-primary">
            <Activity className="h-4 w-4 animate-heart-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{message}</p>
            <p className="text-[10px] text-muted-foreground">Streaming data from encrypted clinical database</p>
          </div>
        </div>
        <div className="hidden sm:block w-32 h-6 opacity-60">
          <ECGWaveSVG />
        </div>
      </div>

      {/* Table Header Placeholder */}
      <div className="bg-muted/40 border-b border-border p-4 grid grid-cols-12 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="col-span-12 sm:col-span-2">
            <ClinicalSkeleton height="14px" width="70%" rounded="md" />
          </div>
        ))}
      </div>

      {/* Table Rows Placeholder */}
      <div className="divide-y divide-border/50 p-2">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4 grid grid-cols-12 gap-4 items-center">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div key={cIdx} className="col-span-12 sm:col-span-2 flex items-center gap-2">
                {cIdx === 0 && (
                  <ClinicalSkeleton height="36px" width="36px" rounded="xl" />
                )}
                <div className="space-y-1.5 flex-1">
                  <ClinicalSkeleton
                    height="12px"
                    width={cIdx === 0 ? "80%" : cIdx === columns - 1 ? "40%" : "60%"}
                    rounded="md"
                  />
                  {cIdx === 0 && (
                    <ClinicalSkeleton height="9px" width="50%" rounded="sm" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ClinicalCardGridSkeleton: React.FC<{
  count?: number;
  message?: string;
  columnsClassName?: string;
}> = ({
  count = 6,
  message = "Loading clinical cards...",
  columnsClassName = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Activity className="h-3.5 w-3.5 animate-heart-pulse" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{message}</span>
        </div>
        <div className="w-24 h-5 opacity-60">
          <ECGWaveSVG />
        </div>
      </div>

      <div className={`grid ${columnsClassName} gap-6`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-card text-card-foreground p-6 rounded-3xl border border-border shadow-xs space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <ClinicalSkeleton height="48px" width="48px" rounded="2xl" />
              <div className="space-y-2 flex-1">
                <ClinicalSkeleton height="16px" width="70%" rounded="md" />
                <ClinicalSkeleton height="11px" width="45%" rounded="md" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <ClinicalSkeleton height="12px" width="100%" rounded="md" />
              <ClinicalSkeleton height="12px" width="85%" rounded="md" />
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <ClinicalSkeleton height="20px" width="60px" rounded="full" />
              <ClinicalSkeleton height="28px" width="80px" rounded="xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardOverviewSkeleton: React.FC<{
  roleTitle?: string;
}> = ({ roleTitle = "HealthCare Dashboard" }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Activity className="h-3.5 w-3.5 animate-heart-pulse" /> Live Telemetry
          </div>
          <ClinicalSkeleton height="28px" width="280px" rounded="xl" />
          <ClinicalSkeleton height="14px" width="340px" rounded="md" />
        </div>
        <div className="w-48 h-12 opacity-80 shrink-0">
          <ECGWaveSVG />
        </div>
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Stethoscope, color: "text-blue-500" },
          { icon: Calendar, color: "text-purple-500" },
          { icon: Heart, color: "text-rose-500" },
          { icon: ShieldCheck, color: "text-emerald-500" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-card text-card-foreground p-6 rounded-3xl border border-border shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-muted/80 flex items-center justify-center">
                <item.icon className={`h-5 w-5 ${item.color} opacity-70 animate-heart-pulse`} />
              </div>
              <ClinicalSkeleton height="14px" width="40px" rounded="full" />
            </div>
            <ClinicalSkeleton height="12px" width="90px" rounded="md" />
            <ClinicalSkeleton height="24px" width="60px" rounded="lg" />
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <ClinicalSkeleton height="18px" width="140px" rounded="md" />
            <ClinicalSkeleton height="14px" width="60px" rounded="md" />
          </div>
          <div className="h-60 rounded-2xl bg-muted/40 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="w-36 h-36 rounded-full border-8 border-muted/80 border-t-primary/50 animate-spin" />
            <div className="absolute inset-0 clinical-shimmer" />
          </div>
        </div>

        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <ClinicalSkeleton height="18px" width="160px" rounded="md" />
            <div className="w-28 h-6 opacity-60">
              <ECGWaveSVG />
            </div>
          </div>
          <div className="h-60 rounded-2xl bg-muted/40 p-6 flex items-end justify-between gap-3 relative overflow-hidden">
            {[40, 70, 55, 90, 65, 80, 45, 75].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-t-xl bg-primary/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 clinical-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <ClinicalTableSkeleton rows={4} columns={5} message={`Synchronizing ${roleTitle} records...`} />
    </div>
  );
};

export const ClinicalProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <ClinicalSkeleton height="96px" width="96px" rounded="full" />
        <div className="space-y-2 flex-1 text-center sm:text-left">
          <ClinicalSkeleton height="24px" width="200px" rounded="lg" />
          <ClinicalSkeleton height="14px" width="140px" rounded="md" />
          <div className="flex items-center gap-2 justify-center sm:justify-start pt-2">
            <ClinicalSkeleton height="20px" width="70px" rounded="full" />
            <ClinicalSkeleton height="20px" width="90px" rounded="full" />
          </div>
        </div>
        <div className="w-32 h-8 opacity-70">
          <ECGWaveSVG />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-4">
          <ClinicalSkeleton height="18px" width="150px" rounded="md" />
          <div className="space-y-3">
            <ClinicalSkeleton height="36px" width="100%" rounded="xl" />
            <ClinicalSkeleton height="36px" width="100%" rounded="xl" />
            <ClinicalSkeleton height="36px" width="100%" rounded="xl" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-4">
          <ClinicalSkeleton height="18px" width="150px" rounded="md" />
          <div className="space-y-3">
            <ClinicalSkeleton height="36px" width="100%" rounded="xl" />
            <ClinicalSkeleton height="36px" width="100%" rounded="xl" />
            <ClinicalSkeleton height="36px" width="100%" rounded="xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalSkeleton;

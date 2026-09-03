"use client";

import React from "react";
import { Activity, Heart, Stethoscope, ShieldCheck, Sparkles } from "lucide-react";

export interface MedicalLoaderProps {
  variant?: "fullscreen" | "card" | "inline" | "banner";
  title?: string;
  subtitle?: string;
  icon?: "heart" | "stethoscope" | "activity" | "shield";
  showECG?: boolean;
  bpm?: number;
  className?: string;
}

export const MedicalLoader: React.FC<MedicalLoaderProps> = ({
  variant = "card",
  title = "Processing Clinical Data...",
  subtitle = "Securely synchronizing your healthcare records",
  icon = "activity",
  showECG = true,
  bpm = 72,
  className = "",
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "heart":
        return <Heart className="h-6 w-6 text-rose-500 fill-rose-500/20" />;
      case "stethoscope":
        return <Stethoscope className="h-6 w-6 text-primary" />;
      case "shield":
        return <ShieldCheck className="h-6 w-6 text-emerald-500" />;
      case "activity":
      default:
        return <Activity className="h-6 w-6 text-primary" />;
    }
  };

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-3 py-2 px-3 text-muted-foreground ${className}`}>
        <div className="relative flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 text-primary">
          <div className="animate-heart-pulse">
            <Activity className="h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-foreground">{title}</span>
          {subtitle && <span className="text-[10px] text-muted-foreground">{subtitle}</span>}
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`w-full rounded-2xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden ${className}`}>
        {/* Subtle scanning bar */}
        <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-scanner-bar pointer-events-none" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-background border border-border shadow-xs">
              <div className="animate-heart-pulse">{renderIcon()}</div>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{title}</p>
              <p className="text-[11px] text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          {showECG && (
            <div className="hidden sm:block w-36 h-8 opacity-80">
              <ECGWaveSVG />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === "fullscreen") {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center relative overflow-hidden ${className}`}>
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-md w-full space-y-6">
          {/* Pulsing Medical Core with Radar Rings */}
          <div className="relative flex items-center justify-center h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-clinical-ripple-1" />
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-clinical-ripple-2" />
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-clinical-ripple-3" />
            
            <div className="relative h-20 w-20 rounded-3xl bg-card border border-border shadow-xl flex items-center justify-center text-primary transition-all">
              <div className="animate-heart-pulse scale-125">
                {renderIcon()}
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="h-3 w-3" /> HealthCare Clinical System
            </div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">{title}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
          </div>

          {/* Animated ECG Waveform Monitor */}
          {showECG && (
            <div className="w-full max-w-xs bg-card/70 backdrop-blur-xs border border-border/80 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  ECG Telemetry Live
                </span>
                <span className="font-mono">{bpm} BPM</span>
              </div>
              <div className="h-12 w-full flex items-center justify-center">
                <ECGWaveSVG />
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground/80 pt-1">
                <span>Rhythm: Normal Sinus</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Encrypted & HIPAA Compliant</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default "card" variant
  return (
    <div className={`py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl border border-border/60 bg-card/50 shadow-xs backdrop-blur-xs relative overflow-hidden ${className}`}>
      {/* Subtle scanner effect across card */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-scanner-bar pointer-events-none" />

      {/* Pulsing Medical Core */}
      <div className="relative flex items-center justify-center h-16 w-16">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-clinical-ripple-1" />
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-clinical-ripple-2" />
        <div className="relative h-14 w-14 rounded-2xl bg-card border border-border shadow-md flex items-center justify-center text-primary">
          <div className="animate-heart-pulse">
            {renderIcon()}
          </div>
        </div>
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {showECG && (
        <div className="w-48 h-8 opacity-75">
          <ECGWaveSVG />
        </div>
      )}
    </div>
  );
};

export const ECGWaveSVG: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 300 60"
      className={`w-full h-full text-primary overflow-visible ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ecg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Grid Guide line */}
      <line
        x1="0"
        y1="30"
        x2="300"
        y2="30"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* ECG Cardiac Waveform Path: Baseline -> P wave -> PR -> Q dip -> R peak -> S dip -> ST -> T wave -> Baseline */}
      <path
        d="M 0 30 
           L 35 30 
           Q 42 24 50 30 
           L 60 30 
           L 65 35 
           L 75 5 
           L 85 55 
           L 95 30 
           L 110 30 
           Q 120 18 130 30 
           L 150 30 
           L 185 30 
           Q 192 24 200 30 
           L 210 30 
           L 215 35 
           L 225 5 
           L 235 55 
           L 245 30 
           L 260 30 
           Q 270 18 280 30 
           L 300 30"
        stroke="url(#ecg-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-ecg-line"
      />
    </svg>
  );
};

export default MedicalLoader;

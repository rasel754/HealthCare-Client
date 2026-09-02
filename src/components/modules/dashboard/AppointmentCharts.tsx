"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { IAppointment } from "@/src/types/domain.types";
import { AppointmentStatus, PaymentStatus } from "@/src/types/auth.type";
import { PieChart as PieIcon, BarChart3, Calendar, Layers, ShieldCheck, Activity } from "lucide-react";

interface AppointmentChartsProps {
  appointments: IAppointment[];
  scopeTitle: string;
  scopeSubtitle: string;
  badgeLabel?: string;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "#3b82f6", // Blue
  INPROGRESS: "#a855f7", // Purple
  COMPLETED: "#10b981", // Emerald
  CANCELED: "#f43f5e", // Rose
};

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Scheduled",
  INPROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

export const AppointmentCharts: React.FC<AppointmentChartsProps> = ({
  appointments = [],
  scopeTitle,
  scopeSubtitle,
  badgeLabel = "Analytics",
  isLoading = false,
}) => {
  // 1. Compute Pie Chart Data (Appointment Status Distribution)
  const pieChartData = useMemo(() => {
    const counts: Record<string, number> = {
      [AppointmentStatus.SCHEDULED]: 0,
      [AppointmentStatus.INPROGRESS]: 0,
      [AppointmentStatus.COMPLETED]: 0,
      [AppointmentStatus.CANCELED]: 0,
    };

    appointments.forEach((app) => {
      const status = app.status || AppointmentStatus.SCHEDULED;
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.keys(counts).map((statusKey) => ({
      name: STATUS_LABELS[statusKey] || statusKey,
      rawStatus: statusKey,
      value: counts[statusKey],
      color: STATUS_COLORS[statusKey] || "#64748b",
    }));
  }, [appointments]);

  // 2. Compute Bar Chart Data (Appointments by Schedule Date / Status timeline)
  const barChartData = useMemo(() => {
    if (!appointments.length) return [];

    // Group appointments by date or fallback to month/status
    const dateMap: Record<string, { date: string; Scheduled: number; Completed: number; Canceled: number; InProgress: number; Total: number }> = {};

    appointments.forEach((app) => {
      let rawDate = app.schedule?.startDate || app.createdAt;
      let formattedDate = "Unscheduled";

      if (rawDate) {
        try {
          const dateObj = new Date(rawDate);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          } else {
            formattedDate = String(rawDate);
          }
        } catch {
          formattedDate = String(rawDate);
        }
      }

      if (!dateMap[formattedDate]) {
        dateMap[formattedDate] = {
          date: formattedDate,
          Scheduled: 0,
          Completed: 0,
          Canceled: 0,
          InProgress: 0,
          Total: 0,
        };
      }

      dateMap[formattedDate].Total += 1;
      if (app.status === AppointmentStatus.SCHEDULED) dateMap[formattedDate].Scheduled += 1;
      else if (app.status === AppointmentStatus.COMPLETED) dateMap[formattedDate].Completed += 1;
      else if (app.status === AppointmentStatus.CANCELED) dateMap[formattedDate].Canceled += 1;
      else if (app.status === AppointmentStatus.INPROGRESS) dateMap[formattedDate].InProgress += 1;
    });

    return Object.values(dateMap).slice(-8); // Show up to last 8 dates for clean visual fit
  }, [appointments]);

  // Payment Status Summary
  const paymentStats = useMemo(() => {
    let paid = 0;
    let unpaid = 0;
    appointments.forEach((app) => {
      if (app.paymentStatus === PaymentStatus.PAID) paid++;
      else unpaid++;
    });
    return { paid, unpaid };
  }, [appointments]);

  const totalAppointments = appointments.length;

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 text-center animate-pulse space-y-4">
        <div className="h-6 bg-accent rounded-xl w-1/3 mx-auto"></div>
        <div className="h-48 bg-accent/40 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section with Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card text-card-foreground border border-border rounded-3xl p-6 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Activity className="h-3.5 w-3.5" /> {badgeLabel}
          </div>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">{scopeTitle}</h3>
          <p className="text-xs text-muted-foreground">{scopeSubtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-accent/50 border border-border text-center">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Bookings</p>
            <p className="text-lg font-extrabold text-foreground">{totalAppointments}</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Paid Revenue</p>
            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{paymentStats.paid}</p>
          </div>
        </div>
      </div>

      {totalAppointments === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-dashed border-border text-center space-y-3 shadow-xs">
          <Calendar className="h-12 w-12 text-muted-foreground/60 mx-auto" />
          <h4 className="text-base font-bold text-foreground">No Appointment Analytics Data Yet</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Once appointment bookings are created, status distribution pie charts and timeline bar charts will be dynamically generated here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pie Chart Card (Status Distribution) */}
          <div className="lg:col-span-5 bg-card text-card-foreground border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <PieIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Status Distribution</h4>
                  <p className="text-[11px] text-muted-foreground">Appointments by status share</p>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      color: "hsl(var(--foreground))",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                    formatter={(value: any, name: any) => [`${value} appointment(s)`, `${name}`]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-xs font-semibold text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Pie Legend breakdown list */}
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
              {pieChartData.map((item) => (
                <div key={item.rawStatus} className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl bg-accent/30 border border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-muted-foreground text-[11px]">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart Card (Appointments Timeline & Breakdown) */}
          <div className="lg:col-span-7 bg-card text-card-foreground border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Appointments Timeline</h4>
                  <p className="text-[11px] text-muted-foreground">Bookings breakdown by schedule date</p>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "currentColor", fontSize: 11, opacity: 0.7 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "currentColor", fontSize: 11, opacity: 0.7 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      color: "hsl(var(--foreground))",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-xs font-semibold text-foreground">{value}</span>}
                  />
                  <Bar dataKey="Scheduled" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Canceled" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick footnote */}
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
              <span>Showing recent appointment schedules timeline</span>
              <span className="font-semibold text-primary">Live Data Synchronized</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

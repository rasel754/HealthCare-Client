"use client";

import { ISchedule } from "@/src/types/domain.types";
import { getScheduleDetails } from "@/src/utils/schedule.utils";
import { Button } from "@/src/components/ui/button";
import {
  X,
  Clock,
  Calendar,
  Timer,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  CalendarCheck,
  Hash,
  Edit,
  Trash2,
} from "lucide-react";

interface ScheduleDetailsModalProps {
  isOpen: boolean;
  schedule: ISchedule | null;
  onClose: () => void;
  onEdit?: (schedule: ISchedule) => void;
  onDelete?: (schedule: ISchedule) => void;
}

export default function ScheduleDetailsModal({
  isOpen,
  schedule,
  onClose,
  onEdit,
  onDelete,
}: ScheduleDetailsModalProps) {
  if (!isOpen || !schedule) return null;

  const details = getScheduleDetails(schedule);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-lg leading-tight">
                Schedule Slot Details
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Full metadata & status overview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Schedule ID Badge */}
        <div className="bg-accent/40 border border-border p-3.5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Hash className="h-4 w-4 text-primary" />
            <span>Schedule ID</span>
          </div>
          <code className="text-xs font-mono font-bold text-foreground bg-background px-2.5 py-1 rounded-lg border border-border">
            {details.id}
          </code>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Start Time */}
          <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Start Time</span>
            </div>
            <p className="font-bold text-foreground">{details.startStr}</p>
          </div>

          {/* End Time */}
          <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>End Time</span>
            </div>
            <p className="font-bold text-foreground">{details.endStr}</p>
          </div>

          {/* Duration */}
          <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <Timer className="h-3.5 w-3.5 text-amber-500" />
              <span>Duration</span>
            </div>
            <p className="font-bold text-foreground">{details.durationStr}</p>
          </div>

          {/* Doctor Slots */}
          <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <UserCheck className="h-3.5 w-3.5 text-blue-500" />
              <span>Doctor Slots</span>
            </div>
            <p className="font-bold text-foreground">
              {details.doctorSlotsCount} {details.doctorSlotsCount === 1 ? "Slot Claimed" : "Slots Claimed"}
            </p>
            {details.doctorNames && (
              <p className="text-[11px] text-primary font-medium truncate" title={details.doctorNames}>
                👨‍⚕️ {details.doctorNames}
              </p>
            )}
          </div>

          {/* Booked Status */}
          <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              {details.isBooked ? (
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              )}
              <span>Booked Status</span>
            </div>
            <div>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  details.isBooked
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {details.isBooked ? "BOOKED" : "AVAILABLE"}
              </span>
            </div>
          </div>

          {/* Appointment */}
          <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              <span>Appointment</span>
            </div>
            <p className="font-bold text-foreground">{details.appointmentText}</p>
          </div>

          {/* Created At */}
          <div className="bg-background border border-border p-3.5 rounded-2xl space-y-1 sm:col-span-2">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <CalendarCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Created At</span>
            </div>
            <p className="font-bold text-foreground">{details.createdStr}</p>
          </div>
        </div>

        {/* Action Buttons inside View details modal */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-4 h-10 text-xs font-semibold"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                  onEdit(schedule);
                }}
                className="rounded-xl px-4 h-10 text-xs font-semibold text-amber-600 hover:bg-amber-500/10 border-amber-500/30 gap-1.5"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(schedule);
                }}
                className="rounded-xl px-4 h-10 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white gap-1.5 shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

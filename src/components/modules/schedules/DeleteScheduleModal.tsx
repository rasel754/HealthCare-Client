"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScheduleService } from "@/src/services/schedule.services";
import { ISchedule } from "@/src/types/domain.types";
import { getScheduleDetails } from "@/src/utils/schedule.utils";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, Trash2, X, Loader2, Calendar, Clock, Timer, Hash } from "lucide-react";

interface DeleteScheduleModalProps {
  isOpen: boolean;
  schedule: ISchedule | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteScheduleModal({
  isOpen,
  schedule,
  onClose,
  onSuccess,
}: DeleteScheduleModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteScheduleService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["all-doctor-schedules"] });
      if (onSuccess) onSuccess();
      onClose();
    },
  });

  if (!isOpen || !schedule) return null;

  const details = getScheduleDetails(schedule);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-lg leading-tight">Delete Schedule Slot</h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Confirm removal of schedule slot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Slot Summary */}
        <div className="bg-accent/40 border border-border/80 p-4 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <Hash className="h-3.5 w-3.5 text-primary" /> Schedule ID
            </span>
            <span className="font-bold text-foreground">{details.id}</span>
          </div>

          <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-foreground font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{details.startStr}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Timer className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{details.durationStr}</span>
            </div>
          </div>
        </div>

        {/* Warning Text */}
        <div className="text-xs text-muted-foreground space-y-1 bg-rose-500/5 border border-rose-500/10 p-3.5 rounded-xl">
          <p className="font-semibold text-rose-600 dark:text-rose-400">
            Warning: This action will permanently remove this schedule slot.
          </p>
          <p className="text-muted-foreground">
            Doctors will no longer be able to claim this slot for consultation appointments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="rounded-xl px-5 h-11 text-xs font-semibold hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => deleteMutation.mutate(schedule.id)}
            disabled={deleteMutation.isPending}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 h-11 text-xs font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Schedule Slot
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

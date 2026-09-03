"use client";

import { IDoctor } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, Trash2, X, Loader2, Building2, Hash } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  doctor: IDoctor | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  doctor,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header with Danger Badge & Close */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-lg leading-tight">Delete Doctor Account</h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Confirm account removal from directory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Doctor Summary Card */}
        <div className="bg-accent/40 border border-border/80 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0 overflow-hidden border border-primary/20">
              {doctor.profilePhoto ? (
                <img src={doctor.profilePhoto} alt={doctor.name} className="h-full w-full object-cover" />
              ) : (
                doctor.name[0]
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-foreground text-sm truncate">{doctor.name}</h4>
              <p className="text-xs text-primary font-semibold truncate">{doctor.designation || "Specialist Doctor"}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 truncate">
              <Hash className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{doctor.registrationNumber || "No Reg #"}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{doctor.currentWorkingPlace || "Workplace N/A"}</span>
            </div>
          </div>
        </div>

        {/* Warning Text */}
        <div className="text-xs text-muted-foreground space-y-1 bg-rose-500/5 border border-rose-500/10 p-3.5 rounded-xl">
          <p className="font-semibold text-rose-600 dark:text-rose-400">
            Warning: This action will soft-delete the doctor&apos;s profile.
          </p>
          <p className="text-muted-foreground">
            The doctor will no longer appear in the directory or receive new patient bookings.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl px-5 h-11 text-xs font-semibold hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 h-11 text-xs font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Doctor Account
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

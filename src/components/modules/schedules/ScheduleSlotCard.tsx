"use client";

import { useState, useRef, useEffect } from "react";
import { ISchedule } from "@/src/types/domain.types";
import { getScheduleDetails } from "@/src/utils/schedule.utils";
import ScheduleDetailsModal from "./ScheduleDetailsModal";
import EditScheduleModal from "./EditScheduleModal";
import DeleteScheduleModal from "./DeleteScheduleModal";
import { Button } from "@/src/components/ui/button";
import {
  Calendar,
  Clock,
  Timer,
  UserCheck,
  FileText,
  CalendarCheck,
  Hash,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

interface ScheduleSlotCardProps {
  slot: ISchedule;
  onEdit?: (slot: ISchedule) => void;
  onDelete?: (slot: ISchedule) => void;
  showActions?: boolean;
}

export default function ScheduleSlotCard({
  slot,
  onEdit,
  onDelete,
  showActions = true,
}: ScheduleSlotCardProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const details = getScheduleDetails(slot);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleEditClick = () => {
    setIsMenuOpen(false);
    if (onEdit) {
      onEdit(slot);
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    if (onDelete) {
      onDelete(slot);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleViewClick = () => {
    setIsMenuOpen(false);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="bg-card text-card-foreground rounded-3xl border border-border p-5 shadow-xs hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between space-y-4 relative">
        {/* Top Header: Schedule ID & Booked Badge & Horizontal Three Dot */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Hash className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider shrink-0">
              ID:
            </span>
            <span className="font-mono text-xs font-bold text-foreground truncate max-w-[110px]" title={details.id}>
              {details.id}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                details.statusState === "BOOKED"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : details.statusState === "ASSIGNED"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              }`}
            >
              {details.statusState}
            </span>

            {/* Horizontal Three Dot Button */}
            {showActions && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent border border-transparent hover:border-border transition-all"
                  aria-label="Slot Actions"
                  title="Actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {/* Dropdown Menu displaying View, Edit, Delete */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 z-30 w-36 bg-card text-card-foreground border border-border rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                    <button
                      type="button"
                      onClick={handleViewClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors text-left"
                    >
                      <Eye className="h-3.5 w-3.5 text-primary" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:text-amber-600 hover:bg-amber-500/10 rounded-xl transition-colors text-left"
                    >
                      <Edit className="h-3.5 w-3.5 text-amber-500" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Core Metadata Fields */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {/* Start Time */}
          <div className="bg-accent/30 p-2.5 rounded-xl border border-border/40 space-y-0.5">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary" /> Start
            </span>
            <p className="font-bold text-foreground truncate" title={details.startStr}>
              {details.startStr}
            </p>
          </div>

          {/* End Time */}
          <div className="bg-accent/30 p-2.5 rounded-xl border border-border/40 space-y-0.5">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" /> End
            </span>
            <p className="font-bold text-foreground truncate" title={details.endStr}>
              {details.endStr}
            </p>
          </div>

          {/* Duration */}
          <div className="bg-accent/30 p-2.5 rounded-xl border border-border/40 space-y-0.5">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <Timer className="h-3 w-3 text-amber-500" /> Duration
            </span>
            <p className="font-bold text-foreground truncate">{details.durationStr}</p>
          </div>

          {/* Doctor Slots */}
          <div className="bg-accent/30 p-2.5 rounded-xl border border-border/40 space-y-0.5">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <UserCheck className="h-3 w-3 text-blue-500" /> Doctor Slots
            </span>
            <p className="font-bold text-foreground truncate" title={details.doctorNames || undefined}>
              {details.doctorSlotsCount === 0
                ? "Unassigned"
                : details.doctorSlotsCount === 1
                ? details.doctorList[0]?.name || "1 Doctor"
                : `${details.doctorSlotsCount} Doctors`}
            </p>
          </div>

          {/* Appointment */}
          <div className="bg-accent/30 p-2.5 rounded-xl border border-border/40 space-y-0.5">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <FileText className="h-3 w-3 text-indigo-500" /> Appointment
            </span>
            <p className="font-bold text-foreground truncate" title={details.appointmentText}>
              {details.appointmentText}
            </p>
          </div>

          {/* Created */}
          <div className="bg-accent/30 p-2.5 rounded-xl border border-border/40 space-y-0.5">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
              <CalendarCheck className="h-3 w-3 text-emerald-500" /> Created
            </span>
            <p className="font-bold text-foreground truncate" title={details.createdStr}>
              {details.createdStr}
            </p>
          </div>
        </div>

        {/* Action Button Trigger Bar */}
        {showActions && (
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewClick}
              className="w-full h-9 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 border-primary/20 gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" /> View Action
            </Button>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <ScheduleDetailsModal
        isOpen={isViewModalOpen}
        schedule={slot}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={() => {
          setIsViewModalOpen(false);
          handleEditClick();
        }}
        onDelete={() => {
          setIsViewModalOpen(false);
          handleDeleteClick();
        }}
      />

      {/* Edit Modal (if not delegated to parent) */}
      {!onEdit && (
        <EditScheduleModal
          isOpen={isEditModalOpen}
          schedule={slot}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Modal (if not delegated to parent) */}
      {!onDelete && (
        <DeleteScheduleModal
          isOpen={isDeleteModalOpen}
          schedule={slot}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}

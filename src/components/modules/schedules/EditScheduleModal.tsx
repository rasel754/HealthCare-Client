"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScheduleService } from "@/src/services/schedule.services";
import { ISchedule } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Edit, X, Loader2, Calendar, Clock } from "lucide-react";

interface EditScheduleModalProps {
  isOpen: boolean;
  schedule: ISchedule | null;
  onClose: () => void;
}

export default function EditScheduleModal({
  isOpen,
  schedule,
  onClose,
}: EditScheduleModalProps) {
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (schedule) {
      // populate from schedule
      let sDate = schedule.startDate || "";
      let eDate = schedule.endDate || "";
      let sTime = schedule.startTime || "";
      let eTime = schedule.endTime || "";

      if (schedule.startDateTime) {
        const d = new Date(schedule.startDateTime);
        if (!isNaN(d.getTime())) {
          sDate = d.toISOString().split("T")[0];
          sTime = d.toTimeString().slice(0, 5);
        }
      }
      if (schedule.endDateTime) {
        const d = new Date(schedule.endDateTime);
        if (!isNaN(d.getTime())) {
          eDate = d.toISOString().split("T")[0];
          eTime = d.toTimeString().slice(0, 5);
        }
      }

      setStartDate(sDate);
      setEndDate(eDate || sDate);
      setStartTime(sTime);
      setEndTime(eTime);
      setMsg(null);
    }
  }, [schedule]);

  const updateMutation = useMutation({
    mutationFn: (payload: { startDate: string; endDate: string; startTime: string; endTime: string }) =>
      updateScheduleService(schedule!.id, payload),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("Schedule slot updated successfully!");
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["schedules"] });
          queryClient.invalidateQueries({ queryKey: ["all-doctor-schedules"] });
          onClose();
        }, 1000);
      }
    },
  });

  if (!isOpen || !schedule) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    updateMutation.mutate({
      startDate,
      endDate: endDate || startDate,
      startTime,
      endTime,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
              <Edit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Edit Schedule Slot</h3>
              <p className="text-xs text-muted-foreground">Modify start/end date and time interval</p>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </div>

        {msg && (
          <div className="p-3 bg-accent text-accent-foreground rounded-xl text-xs font-semibold">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="editSDate" className="text-xs font-semibold">
                Start Date
              </Label>
              <Input
                id="editSDate"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl mt-1 bg-background text-foreground border-input"
              />
            </div>
            <div>
              <Label htmlFor="editEDate" className="text-xs font-semibold">
                End Date
              </Label>
              <Input
                id="editEDate"
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl mt-1 bg-background text-foreground border-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="editSTime" className="text-xs font-semibold">
                Start Time (HH:mm)
              </Label>
              <Input
                id="editSTime"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-xl mt-1 bg-background text-foreground border-input"
              />
            </div>
            <div>
              <Label htmlFor="editETime" className="text-xs font-semibold">
                End Time (HH:mm)
              </Label>
              <Input
                id="editETime"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-xl mt-1 bg-background text-foreground border-input"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

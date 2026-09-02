"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchedulesService, createSchedulesService, deleteScheduleService } from "@/src/services/schedule.services";
import { ISchedule } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Clock, Plus, Trash2, X, Calendar } from "lucide-react";

export default function SchedulesManagementPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const { data: schedulesResponse, isLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: () => getSchedulesService({ limit: 50 }),
  });

  const schedules = (schedulesResponse && "data" in schedulesResponse ? schedulesResponse.data : []) as ISchedule[];

  const createScheduleMutation = useMutation({
    mutationFn: createSchedulesService,
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("Time schedule slots generated successfully!");
        setTimeout(() => {
          setIsAddModalOpen(false);
          setStartDate("");
          setEndDate("");
          setStartTime("");
          setEndTime("");
          setMsg(null);
          queryClient.invalidateQueries({ queryKey: ["schedules"] });
        }, 1200);
      }
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: string) => deleteScheduleService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schedules"] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    createScheduleMutation.mutate({
      startDate,
      endDate,
      startTime,
      endTime,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Time Slots Management</h1>
          <p className="text-xs text-slate-500 mt-1">Generate master consultation date & time interval slots</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl gap-2 h-11 px-5">
          <Plus className="h-4 w-4" /> Generate Schedule Slots
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">Loading schedule slots...</div>
      ) : schedules.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Master Schedules Generated</h3>
          <p className="text-xs text-muted-foreground">Click &apos;Generate Schedule Slots&apos; to create intervals for doctor assignments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((slot) => (
            <div key={slot.id} className="bg-card text-card-foreground rounded-2xl border border-border p-5 flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{slot.startDate}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Time: {slot.startTime} - {slot.endTime}</p>
              </div>

              <button
                onClick={() => deleteScheduleMutation.mutate(slot.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-lg">Generate Schedule Interval</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>

            {msg && <div className="p-3 bg-accent text-accent-foreground rounded-xl text-xs font-semibold">{msg}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sDate">Start Date</Label>
                  <Input id="sDate" type="date" required placeholder="Select start date..." value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
                <div>
                  <Label htmlFor="eDate">End Date</Label>
                  <Input id="eDate" type="date" required placeholder="Select end date..." value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sTime">Start Time (HH:mm)</Label>
                  <Input id="sTime" type="time" required placeholder="e.g. 09:00" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
                <div>
                  <Label htmlFor="eTime">End Time (HH:mm)</Label>
                  <Input id="eTime" type="time" required placeholder="e.g. 10:00" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
              </div>

              <Button type="submit" disabled={createScheduleMutation.isPending} className="w-full rounded-xl mt-2 font-semibold">
                {createScheduleMutation.isPending ? "Generating..." : "Generate Slots"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
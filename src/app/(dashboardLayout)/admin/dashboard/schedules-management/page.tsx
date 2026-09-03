"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchedulesService, createSchedulesService } from "@/src/services/schedule.services";
import { ISchedule } from "@/src/types/domain.types";
import ScheduleTable from "@/src/components/modules/schedules/ScheduleTable";
import ScheduleSlotCard from "@/src/components/modules/schedules/ScheduleSlotCard";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Clock, Plus, X, LayoutGrid, Table as TableIcon } from "lucide-react";

export default function SchedulesManagementPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // Pagination & query state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: schedulesResponse, isLoading } = useQuery({
    queryKey: ["schedules", page, limit, searchTerm],
    queryFn: () => getSchedulesService({ page, limit, searchTerm: searchTerm || undefined }),
    refetchInterval: 3000,
  });

  const schedules = (schedulesResponse && "data" in schedulesResponse ? schedulesResponse.data : []) as ISchedule[];
  const meta = schedulesResponse && "meta" in schedulesResponse ? schedulesResponse.meta : undefined;

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Master Time Slots Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Generate and manage master consultation date & time interval slots</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-accent/50 p-1 rounded-2xl border border-border">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" /> Table View
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "cards"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Slot Cards
            </button>
          </div>

          <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl gap-2 h-11 px-5 shadow-xs">
            <Plus className="h-4 w-4" /> Generate Schedule Slots
          </Button>
        </div>
      </div>

      {/* Main View: Table vs Cards */}
      {viewMode === "table" ? (
        <ScheduleTable
          schedules={schedules}
          isLoading={isLoading}
          meta={meta}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
          searchTerm={searchTerm}
          onSearchChange={(st) => {
            setSearchTerm(st);
            setPage(1);
          }}
        />
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">Loading schedule slots...</div>
          ) : schedules.length === 0 ? (
            <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Master Schedules Generated</h3>
              <p className="text-xs text-muted-foreground">Click &apos;Generate Schedule Slots&apos; to create intervals for doctor assignments.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {schedules.map((slot) => (
                <ScheduleSlotCard key={slot.id} slot={slot} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
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
                  <Label htmlFor="sDate" className="text-xs font-semibold">Start Date</Label>
                  <Input id="sDate" type="date" required placeholder="Select start date..." value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input text-xs" />
                </div>
                <div>
                  <Label htmlFor="eDate" className="text-xs font-semibold">End Date</Label>
                  <Input id="eDate" type="date" required placeholder="Select end date..." value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sTime" className="text-xs font-semibold">Start Time (HH:mm)</Label>
                  <Input id="sTime" type="time" required placeholder="e.g. 09:00" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input text-xs" />
                </div>
                <div>
                  <Label htmlFor="eTime" className="text-xs font-semibold">End Time (HH:mm)</Label>
                  <Input id="eTime" type="time" required placeholder="e.g. 10:00" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input text-xs" />
                </div>
              </div>

              <Button type="submit" disabled={createScheduleMutation.isPending} className="w-full rounded-xl mt-2 font-semibold text-xs h-11">
                {createScheduleMutation.isPending ? "Generating..." : "Generate Slots"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
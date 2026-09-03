"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ISchedule } from "@/src/types/domain.types";
import { getScheduleDetails } from "@/src/utils/schedule.utils";
import ScheduleDetailsModal from "./ScheduleDetailsModal";
import EditScheduleModal from "./EditScheduleModal";
import DeleteScheduleModal from "./DeleteScheduleModal";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MoreHorizontal,
  Stethoscope,
  UserCheck,
} from "lucide-react";

interface ScheduleTableProps {
  schedules: ISchedule[];
  isLoading?: boolean;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

type SortField = "id" | "start" | "end" | "duration" | "doctorSlots" | "booked" | "appointment" | "created";
type SortOrder = "asc" | "desc";

function TableRowActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl"
        title="Actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-30 w-36 bg-card text-card-foreground border border-border rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onView();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors text-left"
          >
            <Eye className="h-3.5 w-3.5 text-primary" />
            View
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:text-amber-600 hover:bg-amber-500/10 rounded-xl transition-colors text-left"
          >
            <Edit className="h-3.5 w-3.5 text-amber-500" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ScheduleTable({
  schedules,
  isLoading,
  meta,
  onPageChange,
  onLimitChange,
  searchTerm: externalSearchTerm,
  onSearchChange: externalOnSearchChange,
}: ScheduleTableProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("created");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [internalPage, setInternalPage] = useState(1);
  const [internalLimit, setInternalLimit] = useState(10);

  const [selectedSlotForView, setSelectedSlotForView] = useState<ISchedule | null>(null);
  const [selectedSlotForEdit, setSelectedSlotForEdit] = useState<ISchedule | null>(null);
  const [selectedSlotForDelete, setSelectedSlotForDelete] = useState<ISchedule | null>(null);

  const search = externalSearchTerm !== undefined ? externalSearchTerm : internalSearch;

  const handleSearchChange = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalSearch(val);
      setInternalPage(1);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const processedSchedules = useMemo(() => {
    let result = [...schedules];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((slot) => {
        const details = getScheduleDetails(slot);
        return (
          details.id.toLowerCase().includes(q) ||
          details.startStr.toLowerCase().includes(q) ||
          details.endStr.toLowerCase().includes(q) ||
          details.appointmentText.toLowerCase().includes(q) ||
          details.doctorNames.toLowerCase().includes(q) ||
          details.statusState.toLowerCase().includes(q)
        );
      });
    }

    result.sort((a, b) => {
      const da = getScheduleDetails(a);
      const db = getScheduleDetails(b);

      let valA: string | number = "";
      let valB: string | number = "";

      switch (sortField) {
        case "id":
          valA = da.id;
          valB = db.id;
          break;
        case "start":
          valA = a.startDateTime || `${a.startDate} ${a.startTime}`;
          valB = b.startDateTime || `${b.startDate} ${b.startTime}`;
          break;
        case "end":
          valA = a.endDateTime || `${a.endDate} ${a.endTime}`;
          valB = b.endDateTime || `${b.endDate} ${b.endTime}`;
          break;
        case "duration":
          valA = da.durationStr;
          valB = db.durationStr;
          break;
        case "doctorSlots":
          valA = da.doctorSlotsCount;
          valB = db.doctorSlotsCount;
          break;
        case "booked":
          valA = da.statusState;
          valB = db.statusState;
          break;
        case "appointment":
          valA = da.appointmentText;
          valB = db.appointmentText;
          break;
        case "created":
          valA = a.createdAt || "";
          valB = b.createdAt || "";
          break;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [schedules, search, sortField, sortOrder]);

  const page = meta?.page || internalPage;
  const limit = meta?.limit || internalLimit;
  const total = meta?.total || processedSchedules.length;
  const totalPages = meta?.totalPages || Math.ceil(total / limit) || 1;

  const paginatedSchedules = useMemo(() => {
    if (meta) return processedSchedules;
    const startIdx = (page - 1) * limit;
    return processedSchedules.slice(startIdx, startIdx + limit);
  }, [meta, processedSchedules, page, limit]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground/60" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 text-primary font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-primary font-bold" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border p-4 rounded-3xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schedule ID, doctor name, date, time..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10 rounded-2xl bg-background text-foreground border-input text-xs"
          />
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                if (onLimitChange) onLimitChange(newLimit);
                else setInternalLimit(newLimit);
              }}
              className="h-10 px-3 rounded-2xl bg-background border border-input text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto min-h-[300px]">
          <Table>
            <TableHeader className="bg-accent/40">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead onClick={() => handleSort("id")} className="cursor-pointer select-none font-bold text-foreground text-xs h-12">
                  <div className="flex items-center">Schedule ID {renderSortIcon("id")}</div>
                </TableHead>
                <TableHead onClick={() => handleSort("start")} className="cursor-pointer select-none font-bold text-foreground text-xs">
                  <div className="flex items-center">Start {renderSortIcon("start")}</div>
                </TableHead>
                <TableHead onClick={() => handleSort("end")} className="cursor-pointer select-none font-bold text-foreground text-xs">
                  <div className="flex items-center">End {renderSortIcon("end")}</div>
                </TableHead>
                <TableHead onClick={() => handleSort("duration")} className="cursor-pointer select-none font-bold text-foreground text-xs">
                  <div className="flex items-center">Duration {renderSortIcon("duration")}</div>
                </TableHead>
                <TableHead onClick={() => handleSort("doctorSlots")} className="cursor-pointer select-none font-bold text-foreground text-xs">
                  <div className="flex items-center">Doctor Slots {renderSortIcon("doctorSlots")}</div>
                </TableHead>
                <TableHead onClick={() => handleSort("booked")} className="cursor-pointer select-none font-bold text-foreground text-xs">
                  <div className="flex items-center">Status {renderSortIcon("booked")}</div>
                </TableHead>
                <TableHead onClick={() => handleSort("appointment")} className="cursor-pointer select-none font-bold text-foreground text-xs">
                  <div className="flex items-center">Appointment {renderSortIcon("appointment")}</div>
                </TableHead>
                <TableHead onClick={() => handleSort("created")} className="cursor-pointer select-none font-bold text-foreground text-xs">
                  <div className="flex items-center">Created {renderSortIcon("created")}</div>
                </TableHead>
                <TableHead className="text-right font-bold text-foreground text-xs pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-xs text-muted-foreground">
                    Loading schedules data...
                  </TableCell>
                </TableRow>
              ) : paginatedSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-36 text-center text-xs text-muted-foreground space-y-2">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="font-semibold text-foreground">No Schedule Slots Found</p>
                    <p className="text-[11px]">Try adjusting your search query or generate new time slots.</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSchedules.map((slot) => {
                  const details = getScheduleDetails(slot);

                  return (
                    <TableRow key={slot.id} className="border-border hover:bg-accent/30 transition-colors">
                      {/* Schedule ID */}
                      <TableCell className="font-mono text-xs font-bold text-foreground py-3.5">
                        <span className="bg-accent px-2 py-0.5 rounded-md border border-border" title={details.id}>
                          #{details.id.slice(0, 8)}...
                        </span>
                      </TableCell>

                      {/* Start */}
                      <TableCell className="text-xs font-medium text-foreground py-3.5 whitespace-nowrap">
                        {details.startStr}
                      </TableCell>

                      {/* End */}
                      <TableCell className="text-xs font-medium text-foreground py-3.5 whitespace-nowrap">
                        {details.endStr}
                      </TableCell>

                      {/* Duration */}
                      <TableCell className="text-xs font-semibold text-foreground py-3.5">
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-[11px]">
                          {details.durationStr}
                        </span>
                      </TableCell>

                      {/* Doctor Slots (Synchronized based on Doctor Assignment as number) */}
                      <TableCell className="text-xs font-medium text-foreground py-3.5 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 border ${
                            details.doctorSlotsCount > 0
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              : "bg-accent/60 text-muted-foreground border-border"
                          }`}
                          title={
                            details.doctorNames
                              ? `Assigned Doctors (${details.doctorSlotsCount}): ${details.doctorNames}`
                              : "0 Doctors Assigned"
                          }
                        >
                          <UserCheck className="h-3.5 w-3.5 text-blue-500" />
                          <span>{details.doctorSlotsCount} {details.doctorSlotsCount === 1 ? "Slot" : "Slots"}</span>
                        </span>
                      </TableCell>

                      {/* Status Column (BOOKED / ASSIGNED / AVAILABLE) */}
                      <TableCell className="py-3.5">
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
                      </TableCell>

                      {/* Appointment */}
                      <TableCell className="text-xs font-medium text-muted-foreground py-3.5">
                        {details.appointmentText}
                      </TableCell>

                      {/* Created */}
                      <TableCell className="text-xs text-muted-foreground py-3.5 whitespace-nowrap">
                        {details.createdStr}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right py-3.5 pr-6">
                        <TableRowActions
                          onView={() => setSelectedSlotForView(slot)}
                          onEdit={() => setSelectedSlotForEdit(slot)}
                          onDelete={() => setSelectedSlotForDelete(slot)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t border-border bg-accent/20 text-xs">
          <div className="text-muted-foreground font-medium">
            Showing{" "}
            <span className="font-bold text-foreground">
              {total === 0 ? 0 : (page - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-foreground">
              {Math.min(page * limit, total)}
            </span>{" "}
            of <span className="font-bold text-foreground">{total}</span> schedule slots
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                const prev = Math.max(1, page - 1);
                if (onPageChange) onPageChange(prev);
                else setInternalPage(prev);
              }}
              className="h-9 px-3 rounded-xl gap-1 text-xs font-semibold"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <span className="font-bold text-foreground px-2">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => {
                const next = Math.min(totalPages, page + 1);
                if (onPageChange) onPageChange(next);
                else setInternalPage(next);
              }}
              className="h-9 px-3 rounded-xl gap-1 text-xs font-semibold"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleDetailsModal
        isOpen={Boolean(selectedSlotForView)}
        schedule={selectedSlotForView}
        onClose={() => setSelectedSlotForView(null)}
        onEdit={(s) => {
          setSelectedSlotForView(null);
          setSelectedSlotForEdit(s);
        }}
        onDelete={(s) => {
          setSelectedSlotForView(null);
          setSelectedSlotForDelete(s);
        }}
      />

      <EditScheduleModal
        isOpen={Boolean(selectedSlotForEdit)}
        schedule={selectedSlotForEdit}
        onClose={() => setSelectedSlotForEdit(null)}
      />

      <DeleteScheduleModal
        isOpen={Boolean(selectedSlotForDelete)}
        schedule={selectedSlotForDelete}
        onClose={() => setSelectedSlotForDelete(null)}
      />
    </div>
  );
}

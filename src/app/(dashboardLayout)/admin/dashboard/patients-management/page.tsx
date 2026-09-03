"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatientsService, deletePatientService } from "@/src/services/patient.services";
import { changeUserStatusService } from "@/src/services/admin.services";
import { IPatient } from "@/src/types/domain.types";
import { UserStatus } from "@/src/types/auth.type";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Users,
  Search,
  CheckCircle,
  Ban,
  Mail,
  Phone,
  MapPin,
  HeartPulse,
  FileText,
  Eye,
  Trash2,
  X,
  Calendar,
  Activity,
  AlertTriangle,
  RotateCcw,
  Loader2,
  UserCheck,
  UserX,
  FileCheck,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { ClinicalCardGridSkeleton } from "@/src/components/shared/ClinicalSkeleton";
import Pagination from "@/src/components/shared/Pagination";

export default function PatientsManagementPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 9;

  const [selectedPatientForView, setSelectedPatientForView] = useState<IPatient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<IPatient | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fetch Patients Query
  const { data: patientsResponse, isLoading } = useQuery({
    queryKey: ["patients", searchTerm, statusFilter, genderFilter, page, limit],
    queryFn: () =>
      getPatientsService({
        searchTerm: searchTerm || undefined,
        "user.status": statusFilter || undefined,
        "patientHealthData.gender": genderFilter || undefined,
        page,
        limit,
      }),
  });

  const patients = (
    patientsResponse &&
    "data" in patientsResponse &&
    Array.isArray(patientsResponse.data)
      ? patientsResponse.data
      : []
  ) as IPatient[];

  const meta =
    patientsResponse && "meta" in patientsResponse
      ? (patientsResponse as any).meta
      : { page: 1, limit, total: patients.length, totalPages: 1 };

  // Calculate quick summary metrics
  const totalCount = meta?.total || patients.length;
  const activeCount = patients.filter(
    (p) => (p.user?.status || p.status) === UserStatus.ACTIVE
  ).length;
  const blockedCount = patients.filter(
    (p) => (p.user?.status || p.status) === UserStatus.BLOCKED
  ).length;
  const withHealthDataCount = patients.filter(
    (p) => Boolean(p.patientHealthData)
  ).length;

  // Change Status Mutation
  const changeStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      changeUserStatusService(userId, status),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg({ text: res.message || "Failed to update status", type: "error" });
      } else {
        setMsg({ text: "Patient account status successfully updated!", type: "success" });
        setTimeout(() => setMsg(null), 3000);
        queryClient.invalidateQueries({ queryKey: ["patients"] });
      }
    },
    onError: (err: any) => {
      setMsg({ text: err?.message || "Failed to update account status", type: "error" });
    },
  });

  // Soft Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePatientService(id),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg({ text: res.message || "Failed to delete patient", type: "error" });
      } else {
        setMsg({ text: "Patient record has been soft-deleted.", type: "success" });
        setPatientToDelete(null);
        setTimeout(() => setMsg(null), 3000);
        queryClient.invalidateQueries({ queryKey: ["patients"] });
      }
    },
    onError: (err: any) => {
      setMsg({ text: err?.message || "Failed to delete patient", type: "error" });
    },
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setGenderFilter("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchTerm || statusFilter || genderFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Patients Directory Management
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Supervise registered patients, inspect clinical profiles, and moderate account access
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 border ${
            msg.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <span>{msg.text}</span>
          <button
            onClick={() => setMsg(null)}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-3xl shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Patients
            </p>
            <h3 className="text-xl font-extrabold text-foreground">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-3xl shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Active Users
            </p>
            <h3 className="text-xl font-extrabold text-foreground">{activeCount}</h3>
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-3xl shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <UserX className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Blocked Accounts
            </p>
            <h3 className="text-xl font-extrabold text-foreground">{blockedCount}</h3>
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-3xl shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Health Profiles
            </p>
            <h3 className="text-xl font-extrabold text-foreground">{withHealthDataCount}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-3xl border border-border shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, email, phone, or address..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-10 rounded-xl bg-background text-foreground border-input text-xs"
            />
          </div>

          {/* Account Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 bg-background border border-input rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Account Statuses</option>
              <option value={UserStatus.ACTIVE}>Active</option>
              <option value={UserStatus.BLOCKED}>Blocked</option>
              <option value={UserStatus.DELETED}>Deleted</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 bg-background border border-input rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
            <span className="text-muted-foreground font-medium">
              Filtered results displayed
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1.5 rounded-xl font-bold"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <ClinicalCardGridSkeleton count={6} message="Synchronizing registered patients..." />
      ) : patients.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <Users className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Patients Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {hasActiveFilters
              ? "No registered patients match your active search or filter criteria."
              : "Registered patients will appear here automatically once onboarded."}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="rounded-xl text-xs mt-2"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => {
              const status = patient.user?.status || patient.status || UserStatus.ACTIVE;
              const isBlocked = status === UserStatus.BLOCKED;
              const resolvedUserId = patient.userId || patient.user?.id || patient.id;
              const healthData = patient.patientHealthData;
              const medicalReports = (patient as any).medicalReports || patient.medicalReport || [];

              return (
                <div
                  key={patient.id}
                  className="bg-card text-card-foreground rounded-3xl border border-border p-6 flex flex-col justify-between shadow-xs space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Header: Avatar, Name & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xl uppercase shrink-0 overflow-hidden border border-purple-500/20">
                          {patient.profilePhoto ? (
                            <img
                              src={patient.profilePhoto}
                              alt={patient.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            patient.name ? patient.name[0] : "P"
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-foreground text-base truncate">
                            {patient.name}
                          </h3>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mt-0.5 ${
                              isBlocked
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : status === UserStatus.DELETED
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedPatientForView(patient)}
                        className="h-8 w-8 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0"
                        title="View Full Health Record"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-accent/40 border border-border p-3.5 rounded-2xl space-y-1.5 text-xs text-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                      {patient.contactNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{patient.contactNumber}</span>
                        </div>
                      )}
                      {patient.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{patient.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Health Data & Clinical Summary Badges */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {healthData?.gender && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg font-semibold">
                            {healthData.gender}
                          </span>
                        )}
                        {healthData?.bloodGroup && (
                          <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg font-semibold flex items-center gap-1">
                            <HeartPulse className="h-3 w-3" />
                            {healthData.bloodGroup.replace("_", " ")}
                          </span>
                        )}
                        {medicalReports.length > 0 && (
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg font-semibold flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {medicalReports.length} {medicalReports.length === 1 ? "Report" : "Reports"}
                          </span>
                        )}
                      </div>

                      {healthData && (
                        <div className="text-[11px] text-muted-foreground grid grid-cols-2 gap-1 pt-1">
                          {healthData.hasAllergies && (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              • Has Allergies
                            </span>
                          )}
                          {healthData.hasDiabetes && (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              • Diabetic
                            </span>
                          )}
                          {healthData.smokingStatus && (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              • Smoker
                            </span>
                          )}
                          {healthData.height && (
                            <span>Height: {healthData.height}</span>
                          )}
                          {healthData.weight && (
                            <span>Weight: {healthData.weight}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPatientToDelete(patient)}
                      className="h-8 rounded-xl text-xs gap-1 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                      title="Delete Patient Record"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPatientForView(patient)}
                        className="h-8 rounded-xl text-xs gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </Button>

                      {isBlocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            changeStatusMutation.mutate({
                              userId: resolvedUserId,
                              status: UserStatus.ACTIVE,
                            })
                          }
                          disabled={changeStatusMutation.isPending}
                          className="h-8 rounded-xl text-xs gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Unblock
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            changeStatusMutation.mutate({
                              userId: resolvedUserId,
                              status: UserStatus.BLOCKED,
                            })
                          }
                          disabled={changeStatusMutation.isPending}
                          className="h-8 rounded-xl text-xs gap-1 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                        >
                          <Ban className="h-3.5 w-3.5" /> Block
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <Pagination
              page={page}
              limit={limit}
              totalCount={meta.total}
              totalPages={meta.totalPages}
              onPageChange={(p) => setPage(p)}
              itemLabel="patients"
            />
          )}
        </div>
      )}

      {/* Patient Clinical Profile Details Modal */}
      {selectedPatientForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl uppercase shrink-0 border border-primary/20">
                  {selectedPatientForView.profilePhoto ? (
                    <img
                      src={selectedPatientForView.profilePhoto}
                      alt={selectedPatientForView.name}
                      className="h-full w-full object-cover rounded-2xl"
                    />
                  ) : (
                    selectedPatientForView.name ? selectedPatientForView.name[0] : "P"
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-lg leading-tight">
                    {selectedPatientForView.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Patient Clinical Profile & Health Records
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientForView(null)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-accent/30 border border-border p-4 rounded-2xl text-xs">
              <div>
                <p className="text-muted-foreground font-medium">Email Address</p>
                <p className="font-semibold text-foreground">{selectedPatientForView.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-medium">Contact Number</p>
                <p className="font-semibold text-foreground">
                  {selectedPatientForView.contactNumber || "Not Provided"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground font-medium">Residential Address</p>
                <p className="font-semibold text-foreground">
                  {selectedPatientForView.address || "Not Provided"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground font-medium">Account Status</p>
                <p className="font-semibold text-foreground">
                  {selectedPatientForView.user?.status || selectedPatientForView.status || "ACTIVE"}
                </p>
              </div>
            </div>

            {/* Health Data Profile */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <HeartPulse className="h-4 w-4 text-primary" /> Health Vitals & History
              </h4>

              {selectedPatientForView.patientHealthData ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-accent/20 border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground">Blood Group</p>
                    <p className="font-bold text-foreground">
                      {selectedPatientForView.patientHealthData.bloodGroup?.replace("_", " ") || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground">Gender</p>
                    <p className="font-bold text-foreground">
                      {selectedPatientForView.patientHealthData.gender || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground">Marital Status</p>
                    <p className="font-bold text-foreground">
                      {selectedPatientForView.patientHealthData.maritalStatus || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground">Height</p>
                    <p className="font-bold text-foreground">
                      {selectedPatientForView.patientHealthData.height || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground">Weight</p>
                    <p className="font-bold text-foreground">
                      {selectedPatientForView.patientHealthData.weight || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground">Allergies</p>
                    <p className="font-bold text-foreground">
                      {selectedPatientForView.patientHealthData.hasAllergies ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground">Diabetes</p>
                    <p className="font-bold text-foreground">
                      {selectedPatientForView.patientHealthData.hasDiabetes ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground">Smoking Status</p>
                    <p className="font-bold text-foreground">
                      {selectedPatientForView.patientHealthData.smokingStatus ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 border border-border rounded-xl">
                    <p className="text-[11px] text-muted-foreground">Past Surgeries</p>
                    <p className="font-bold text-foreground">
                      {selectedPatientForView.patientHealthData.hasPastSurgeries ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/40 rounded-2xl text-center text-xs text-muted-foreground border border-border">
                  No health vitals or baseline metrics registered yet for this patient.
                </div>
              )}
            </div>

            {/* Medical Reports */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-primary" /> Uploaded Medical Reports
              </h4>

              {(() => {
                const reports =
                  (selectedPatientForView as any).medicalReports ||
                  selectedPatientForView.medicalReport ||
                  [];

                if (reports.length === 0) {
                  return (
                    <div className="p-4 bg-muted/40 rounded-2xl text-center text-xs text-muted-foreground border border-border">
                      No clinical reports uploaded.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {reports.map((r: any) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-3 bg-accent/30 border border-border rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-semibold text-foreground truncate">
                            {r.reportName}
                          </span>
                        </div>
                        {r.reportLink && (
                          <a
                            href={r.reportLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline font-semibold shrink-0 ml-2"
                          >
                            View Document <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end pt-3 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setSelectedPatientForView(null)}
                className="rounded-xl px-5 h-10 text-xs font-semibold"
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Soft Delete Confirmation Modal */}
      {patientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-lg leading-tight">
                    Delete Patient Record
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Confirm soft deletion from directory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPatientToDelete(null)}
                disabled={deleteMutation.isPending}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-2 text-xs">
              <p className="font-bold text-foreground">{patientToDelete.name}</p>
              <p className="text-muted-foreground">{patientToDelete.email}</p>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 bg-rose-500/5 border border-rose-500/10 p-3.5 rounded-xl">
              <p className="font-semibold text-rose-600 dark:text-rose-400">
                Warning: This action will mark the patient account as deleted.
              </p>
              <p className="text-muted-foreground">
                The patient will no longer be able to log in or book appointments.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPatientToDelete(null)}
                disabled={deleteMutation.isPending}
                className="rounded-xl px-5 h-10 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => deleteMutation.mutate(patientToDelete.id)}
                disabled={deleteMutation.isPending}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 h-10 text-xs font-semibold gap-2"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" /> Delete Patient
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
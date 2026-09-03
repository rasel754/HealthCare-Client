"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorsService,
  createDoctorService,
  updateDoctorService,
  deleteDoctorService,
} from "@/src/services/doctor.services";
import { getSpecialtiesService } from "@/src/services/specialty.services";
import { IDoctor, ISpecialty } from "@/src/types/domain.types";
import { Gender } from "@/src/types/auth.type";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import SearchAndFilterBar from "@/src/components/shared/SearchAndFilterBar";
import CardGrid from "@/src/components/shared/CardGrid";
import Pagination from "@/src/components/shared/Pagination";
import DeleteConfirmationModal from "@/src/components/shared/DeleteConfirmationModal";
import {
  Stethoscope,
  Plus,
  Trash2,
  Edit,
  X,
  Eye,
  Phone,
  Award,
  Star,
  Building2,
  Mail,
  UserCheck,
  Hash,
  BadgeCheck,
  Calendar,
} from "lucide-react";

function DoctorsManagementContent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize filter state from URL search params
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [selectedGender, setSelectedGender] = useState(searchParams.get("gender") || "");
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    searchParams.get("specialty") || searchParams.get("specialties.specialtyId") || ""
  );
  const [feeRange, setFeeRange] = useState(searchParams.get("feeRange") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 6;

  // Sync state with URL search params changes (e.g. browser back/forward)
  useEffect(() => {
    const paramSearch = searchParams.get("searchTerm") || "";
    const paramGender = searchParams.get("gender") || "";
    const paramSpecialty = searchParams.get("specialty") || searchParams.get("specialties.specialtyId") || "";
    const paramFeeRange = searchParams.get("feeRange") || "";
    const paramPage = Number(searchParams.get("page")) || 1;

    setSearchTerm(paramSearch);
    setSelectedGender(paramGender);
    setSelectedSpecialty(paramSpecialty);
    setFeeRange(paramFeeRange);
    setPage(paramPage);
  }, [searchParams]);

  // Helper to update URL search params
  const updateUrlParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === "" || val === null) {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });

      const queryString = params.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<IDoctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<IDoctor | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<IDoctor | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Form State for creating doctor
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [currentWorkingPlace, setCurrentWorkingPlace] = useState("");
  const [appointmentFee, setAppointmentFee] = useState<number>(50);
  const [experience, setExperience] = useState<number>(5);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<string[]>([]);

  // Form State for editing doctor
  const [editName, setEditName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editRegNum, setEditRegNum] = useState("");
  const [editQual, setEditQual] = useState("");
  const [editDesig, setEditDesig] = useState("");
  const [editWorkPlace, setEditWorkPlace] = useState("");
  const [editFee, setEditFee] = useState<number>(50);
  const [editExp, setEditExp] = useState<number>(5);
  const [editGender, setEditGender] = useState<Gender>(Gender.MALE);
  const [editSpecialtyIds, setEditSpecialtyIds] = useState<string[]>([]);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);

  const { data: specialtiesResponse } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => getSpecialtiesService(),
  });

  // Query doctors using backend server-side filtering, search, and pagination
  const { data: doctorsResponse, isLoading } = useQuery({
    queryKey: ["doctors", searchTerm, selectedGender, selectedSpecialty, feeRange, page, limit],
    queryFn: () => {
      const queryParams: Record<string, unknown> = {
        page,
        limit,
      };

      if (searchTerm) queryParams.searchTerm = searchTerm;
      if (selectedGender) queryParams.gender = selectedGender;
      if (selectedSpecialty) queryParams["specialties.specialtyId"] = selectedSpecialty;

      if (feeRange === "under-50") {
        queryParams["appointmentFee[lte]"] = 50;
      } else if (feeRange === "50-100") {
        queryParams["appointmentFee[gte]"] = 50;
        queryParams["appointmentFee[lte]"] = 100;
      } else if (feeRange === "100-200") {
        queryParams["appointmentFee[gte]"] = 100;
        queryParams["appointmentFee[lte]"] = 200;
      } else if (feeRange === "200-plus") {
        queryParams["appointmentFee[gt]"] = 200;
      }

      return getDoctorsService(queryParams);
    },
  });

  const specialties = (
    specialtiesResponse && "data" in specialtiesResponse ? specialtiesResponse.data : []
  ) as ISpecialty[];

  const doctors = (
    doctorsResponse && "data" in doctorsResponse ? doctorsResponse.data : []
  ) as IDoctor[];

  const meta = doctorsResponse && "meta" in doctorsResponse ? doctorsResponse.meta : undefined;

  // Extract list of specialties for a doctor
  const getDoctorSpecialties = (doc: IDoctor): { id: string; title: string }[] => {
    const list: { id: string; title: string }[] = [];
    const rawSpecialties = doc.specialties || doc.doctorSpecialties || [];

    if (Array.isArray(rawSpecialties)) {
      rawSpecialties.forEach((item: any) => {
        if (typeof item === "string") {
          list.push({ id: item, title: item });
        } else if (item.specialty) {
          list.push({ id: item.specialty.id || item.specialtyId, title: item.specialty.title });
        } else if (item.specialties) {
          list.push({ id: item.specialties.id || item.specialtiesId, title: item.specialties.title });
        } else if (item.title) {
          list.push({ id: item.id, title: item.title });
        }
      });
    }
    return list;
  };

  const totalPages = meta?.totalPages || Math.ceil(doctors.length / limit) || 1;
  const totalCount = meta?.total || doctors.length;

  // Event Handlers for Filters & Pagination with URL Synchronization
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
    updateUrlParams({ searchTerm: val, page: 1 });
  };

  const handleGenderChange = (val: string) => {
    setSelectedGender(val);
    setPage(1);
    updateUrlParams({ gender: val, page: 1 });
  };

  const handleFeeRangeChange = (val: string) => {
    setFeeRange(val);
    setPage(1);
    updateUrlParams({ feeRange: val, page: 1 });
  };

  const handleSpecialtyChange = (val: string) => {
    setSelectedSpecialty(val);
    setPage(1);
    updateUrlParams({ specialty: val, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrlParams({ page: newPage });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGender("");
    setSelectedSpecialty("");
    setFeeRange("");
    setPage(1);
    router.replace(pathname, { scroll: false });
  };

  const resetAddForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setContactNumber("");
    setAddress("");
    setRegistrationNumber("");
    setQualification("");
    setDesignation("");
    setCurrentWorkingPlace("");
    setAppointmentFee(50);
    setExperience(5);
    setGender(Gender.MALE);
    setSelectedSpecialtyIds([]);
  };

  const createDoctorMutation = useMutation({
    mutationFn: createDoctorService,
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("Doctor account created successfully!");
        setTimeout(() => {
          setIsAddModalOpen(false);
          resetAddForm();
          setMsg(null);
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
        }, 1200);
      }
    },
  });

  const updateDoctorMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateDoctorService(id, payload),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("Doctor profile updated successfully!");
        setTimeout(() => {
          setEditingDoctor(null);
          setMsg(null);
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
        }, 1200);
      }
    },
  });

  const deleteDoctorMutation = useMutation({
    mutationFn: (id: string) => deleteDoctorService(id),
    onSuccess: () => {
      setDeletingDoctor(null);
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSpecialtyIds.length === 0) {
      setMsg("Please select at least one medical specialty.");
      return;
    }
    setMsg(null);
    createDoctorMutation.mutate({
      password,
      doctor: {
        name,
        email,
        contactNumber,
        address: address || undefined,
        registrationNumber,
        qualification,
        designation,
        currentWorkingPlace,
        appointmentFee: Number(appointmentFee),
        experience: Number(experience),
        gender,
      },
      specialties: selectedSpecialtyIds,
    });
  };

  const openEditModal = (doc: IDoctor) => {
    setEditingDoctor(doc);
    setEditName(doc.name || "");
    setEditContact(doc.contactNumber || "");
    setEditAddress(doc.address || "");
    setEditRegNum(doc.registrationNumber || "");
    setEditQual(doc.qualification || "");
    setEditDesig(doc.designation || "");
    setEditWorkPlace(doc.currentWorkingPlace || "");
    setEditFee(doc.appointmentFee || 50);
    setEditExp(doc.experience || 5);
    setEditGender(doc.gender || Gender.MALE);
    setEditPhotoFile(null);
    setEditPhotoPreview(doc.profilePhoto || null);

    const initialSpecialtyIds =
      doc.specialties?.map((s: any) => (typeof s === "string" ? s : s.id || s.specialtyId || s.specialty?.id)).filter(Boolean) ||
      doc.doctorSpecialties?.map((ds: any) => ds.specialtiesId || ds.specialties?.id).filter(Boolean) ||
      [];
    setEditSpecialtyIds(initialSpecialtyIds as string[]);
  };

  const toggleEditSpecialtySelect = (id: string) => {
    if (editSpecialtyIds.includes(id)) {
      setEditSpecialtyIds(editSpecialtyIds.filter((item) => item !== id));
    } else {
      setEditSpecialtyIds([...editSpecialtyIds, id]);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    setMsg(null);

    const dataPayload: Record<string, unknown> = {
      name: editName,
      contactNumber: editContact,
      address: editAddress || undefined,
      registrationNumber: editRegNum,
      qualification: editQual,
      designation: editDesig,
      currentWorkingPlace: editWorkPlace,
      appointmentFee: Number(editFee),
      experience: Number(editExp),
      gender: editGender,
    };

    if (editSpecialtyIds.length > 0) {
      dataPayload.specialties = editSpecialtyIds;
    }

    if (editPhotoFile) {
      const formData = new FormData();
      formData.append("profilePhoto", editPhotoFile);
      formData.append("data", JSON.stringify(dataPayload));
      updateDoctorMutation.mutate({
        id: editingDoctor.id,
        payload: formData,
      });
    } else {
      updateDoctorMutation.mutate({
        id: editingDoctor.id,
        payload: dataPayload,
      });
    }
  };

  const toggleSpecialtySelect = (id: string) => {
    if (selectedSpecialtyIds.includes(id)) {
      setSelectedSpecialtyIds(selectedSpecialtyIds.filter((item) => item !== id));
    } else {
      setSelectedSpecialtyIds([...selectedSpecialtyIds, id]);
    }
  };

  const filtersConfig = [
    {
      id: "gender",
      value: selectedGender,
      placeholder: "All Genders",
      options: [
        { label: "Male Doctor", value: Gender.MALE },
        { label: "Female Doctor", value: Gender.FEMALE },
      ],
      onChange: handleGenderChange,
    },
    {
      id: "feeRange",
      value: feeRange,
      placeholder: "All Fee Ranges",
      options: [
        { label: "Under $50", value: "under-50" },
        { label: "$50 - $100", value: "50-100" },
        { label: "$100 - $200", value: "100-200" },
        { label: "Above $200", value: "200-plus" },
      ],
      onChange: handleFeeRangeChange,
    },
    {
      id: "specialty",
      value: selectedSpecialty,
      placeholder: "All Specialties",
      options: specialties.map((s) => ({ label: s.title, value: s.id })),
      onChange: handleSpecialtyChange,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-primary" /> Doctors Directory Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage medical specialist profiles, filter directory records, and onboard doctor accounts.
          </p>
        </div>
        <Button
          onClick={() => {
            resetAddForm();
            setMsg(null);
            setIsAddModalOpen(true);
          }}
          className="rounded-xl gap-2 h-11 px-5 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" /> Add Doctor Account
        </Button>
      </div>

      {/* Reusable Search & Filters Bar */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by doctor name or registration..."
        filters={filtersConfig}
        onClearFilters={handleClearFilters}
        hasActiveFilters={Boolean(searchTerm || selectedGender || selectedSpecialty || feeRange)}
      />

      {/* Reusable Card Grid Component */}
      <CardGrid
        items={doctors}
        keyExtractor={(doc) => doc.id}
        isLoading={isLoading}
        loadingMessage="Loading registered doctor accounts..."
        emptyTitle="No Doctors Found"
        emptyDescription="No doctors match your filter criteria or search parameters. Try adjusting or clearing filters."
        emptyIcon={<Stethoscope className="h-12 w-12 text-muted-foreground mx-auto" />}
        hasActiveFilters={Boolean(searchTerm || selectedGender || selectedSpecialty || feeRange)}
        onClearFilters={handleClearFilters}
        renderCard={(doc) => {
          const docSpecs = getDoctorSpecialties(doc);
          return (
            <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 space-y-5 h-full">
              <div className="space-y-4">
                {/* Doctor Profile Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden shadow-xs">
                      {doc.profilePhoto ? (
                        <img src={doc.profilePhoto} alt={doc.name} className="h-full w-full object-cover" />
                      ) : (
                        doc.name[0]
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base leading-snug">{doc.name}</h3>
                      <p className="text-xs text-primary font-semibold">{doc.designation}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">{doc.qualification}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(doc)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                      title="Edit Doctor Profile"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingDoctor(doc)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete Doctor Account"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Specialties List */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Specialties</p>
                  <div className="flex flex-wrap gap-1.5">
                    {docSpecs.length === 0 ? (
                      <span className="text-[11px] text-muted-foreground italic">General Medicine</span>
                    ) : (
                      docSpecs.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 bg-primary/10 text-primary text-[11px] font-bold rounded-lg border border-primary/20"
                        >
                          {s.title}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Stats & Contact Card */}
                <div className="bg-accent/40 border border-border p-3.5 rounded-2xl space-y-2 text-xs text-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <Award className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{doc.experience || 0} Years Exp.</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.averageRating ? doc.averageRating.toFixed(1) : "5.0"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="font-semibold text-foreground">{doc.contactNumber || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Footer: Fee & View More Modal Trigger */}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Consultation Fee</p>
                  <p className="text-xl font-extrabold text-foreground">${doc.appointmentFee}</p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setViewingDoctor(doc)}
                  className="rounded-xl gap-1.5 text-xs font-semibold px-4 h-10 shadow-2xs hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Eye className="h-3.5 w-3.5" /> View More
                </Button>
              </div>
            </div>
          );
        }}
      />

      {/* Reusable Pagination Component */}
      <Pagination
        page={page}
        limit={limit}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemLabel="doctors"
      />

      {/* Extended Details Modal (View More) */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl shrink-0 overflow-hidden shadow-xs">
                  {viewingDoctor.profilePhoto ? (
                    <img src={viewingDoctor.profilePhoto} alt={viewingDoctor.name} className="h-full w-full object-cover" />
                  ) : (
                    viewingDoctor.name[0]
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-xl">{viewingDoctor.name}</h3>
                  <p className="text-xs text-primary font-bold">{viewingDoctor.designation}</p>
                  <p className="text-xs text-muted-foreground font-medium">{viewingDoctor.qualification}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingDoctor(null)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Current Working Place */}
              <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase text-[10px]">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> Workplace
                </div>
                <p className="font-semibold text-foreground text-sm">{viewingDoctor.currentWorkingPlace || "N/A"}</p>
              </div>

              {/* Email Address */}
              <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase text-[10px]">
                  <Mail className="h-3.5 w-3.5 text-primary" /> Email Address
                </div>
                <p className="font-semibold text-foreground text-sm truncate">{viewingDoctor.email || "N/A"}</p>
              </div>

              {/* Medical Reg Number */}
              <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase text-[10px]">
                  <Hash className="h-3.5 w-3.5 text-primary" /> Medical Reg. Number
                </div>
                <p className="font-semibold text-foreground text-sm">{viewingDoctor.registrationNumber || "N/A"}</p>
              </div>

              {/* Account Status */}
              <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase text-[10px]">
                  <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Account Status
                </div>
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      viewingDoctor.isDeleted
                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}
                  >
                    {viewingDoctor.isDeleted ? "DELETED" : viewingDoctor.user?.status || "ACTIVE"}
                  </span>
                </div>
              </div>

              {/* Gender */}
              <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase text-[10px]">
                  <UserCheck className="h-3.5 w-3.5 text-primary" /> Gender
                </div>
                <p className="font-semibold text-foreground text-sm capitalize">{viewingDoctor.gender || "N/A"}</p>
              </div>

              {/* Join Date */}
              <div className="bg-accent/40 border border-border p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase text-[10px]">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Join Date
                </div>
                <p className="font-semibold text-foreground text-sm">
                  {viewingDoctor.createdAt
                    ? new Date(viewingDoctor.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : viewingDoctor.user?.createdAt
                    ? new Date(viewingDoctor.user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Specialties Section */}
            <div className="space-y-2 pt-2 border-t border-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Medical Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {getDoctorSpecialties(viewingDoctor).length === 0 ? (
                  <span className="text-xs text-muted-foreground italic">No specialty assigned</span>
                ) : (
                  getDoctorSpecialties(viewingDoctor).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl border border-primary/20"
                    >
                      {s.title}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => setViewingDoctor(null)} className="w-full rounded-xl h-11 font-semibold">
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-foreground text-xl">Create Doctor Account</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>

            {msg && <div className="p-3 bg-accent text-accent-foreground rounded-xl text-xs font-semibold">{msg}</div>}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Doctor Name *</Label>
                  <Input
                    required
                    placeholder="Dr. Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="jane@healthcare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Password *</Label>
                  <Input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label>Contact Number *</Label>
                  <Input
                    required
                    placeholder="+8801700000000"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
              </div>

              <div>
                <Label>Chamber / Clinic Address</Label>
                <Input
                  placeholder="House 12, Road 5, Dhanmondi, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl mt-1 bg-background text-foreground border-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Registration Number *</Label>
                  <Input
                    required
                    placeholder="REG-10928"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label>Qualification *</Label>
                  <Input
                    required
                    placeholder="MBBS, FCPS"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Designation *</Label>
                  <Input
                    required
                    placeholder="Consultant Cardiologist"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label>Current Working Place *</Label>
                  <Input
                    required
                    placeholder="Square Hospital"
                    value={currentWorkingPlace}
                    onChange={(e) => setCurrentWorkingPlace(e.target.value)}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Appointment Fee ($) *</Label>
                  <Input
                    required
                    type="number"
                    min={0}
                    placeholder="50"
                    value={appointmentFee}
                    onChange={(e) => setAppointmentFee(Number(e.target.value))}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label>Experience (Years) *</Label>
                  <Input
                    required
                    type="number"
                    min={0}
                    placeholder="5"
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="rounded-xl mt-1 bg-background text-foreground border-input"
                  />
                </div>
                <div>
                  <Label>Gender *</Label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full h-10 px-3 border border-input bg-background text-foreground rounded-xl text-sm font-medium mt-1 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Assign Medical Specialties * (Select at least 1)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                  {specialties.map((s) => {
                    const isSelected = selectedSpecialtyIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSpecialtySelect(s.id)}
                        className={`p-2 rounded-xl border text-xs text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 font-bold text-primary"
                            : "border-border bg-card text-foreground hover:bg-accent"
                        }`}
                      >
                        {s.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" disabled={createDoctorMutation.isPending} className="w-full rounded-xl mt-4 h-11 font-semibold">
                {createDoctorMutation.isPending ? "Creating..." : "Create Doctor Account"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-foreground text-xl">Edit Doctor Profile</h3>
              <button onClick={() => setEditingDoctor(null)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>

            {msg && <div className="p-3 bg-accent text-accent-foreground rounded-xl text-xs font-semibold">{msg}</div>}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Profile Photo Upload */}
              <div className="p-4 bg-muted/40 border border-border rounded-2xl flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center overflow-hidden shrink-0">
                  {editPhotoPreview ? (
                    <img src={editPhotoPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <UserCheck className="h-7 w-7 text-primary" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-xs font-bold uppercase text-foreground">Doctor Profile Picture</p>
                  <p className="text-[11px] text-muted-foreground">Select a high-resolution JPG, PNG or WEBP image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditPhotoFile(file);
                        setEditPhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Doctor Name *</Label>
                  <Input required placeholder="Doctor full name" value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
                <div>
                  <Label>Contact Number *</Label>
                  <Input required placeholder="Contact phone number" value={editContact} onChange={(e) => setEditContact(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
              </div>

              <div>
                <Label>Chamber / Address</Label>
                <Input placeholder="Chamber address" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Registration Number *</Label>
                  <Input required placeholder="Registration number" value={editRegNum} onChange={(e) => setEditRegNum(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
                <div>
                  <Label>Qualification *</Label>
                  <Input required placeholder="Medical qualifications" value={editQual} onChange={(e) => setEditQual(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Designation *</Label>
                  <Input required placeholder="Designation" value={editDesig} onChange={(e) => setEditDesig(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
                <div>
                  <Label>Current Working Place *</Label>
                  <Input required placeholder="Hospital / Workplace" value={editWorkPlace} onChange={(e) => setEditWorkPlace(e.target.value)} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Appointment Fee ($) *</Label>
                  <Input required type="number" placeholder="Fee amount" value={editFee} onChange={(e) => setEditFee(Number(e.target.value))} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
                <div>
                  <Label>Experience (Years) *</Label>
                  <Input required type="number" placeholder="Years of experience" value={editExp} onChange={(e) => setEditExp(Number(e.target.value))} className="rounded-xl mt-1 bg-background text-foreground border-input" />
                </div>
                <div>
                  <Label>Gender *</Label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as Gender)}
                    className="w-full h-10 px-3 border border-input bg-background text-foreground rounded-xl text-sm font-medium mt-1 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.OTHER}>Other</option>
                  </select>
                </div>
              </div>

              {/* Specialties Multi-Select */}
              <div className="space-y-2 pt-2">
                <Label>Assigned Medical Specialties ({editSpecialtyIds.length} selected)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                  {specialties.map((s) => {
                    const isSelected = editSpecialtyIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleEditSpecialtySelect(s.id)}
                        className={`p-2 rounded-xl border text-xs text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 font-bold text-primary"
                            : "border-border bg-card text-foreground hover:bg-accent"
                        }`}
                      >
                        {s.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" disabled={updateDoctorMutation.isPending} className="w-full rounded-xl mt-4 h-11 font-semibold">
                {updateDoctorMutation.isPending ? "Updating..." : "Save Doctor Profile"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Doctor Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingDoctor)}
        doctor={deletingDoctor}
        isDeleting={deleteDoctorMutation.isPending}
        onClose={() => setDeletingDoctor(null)}
        onConfirm={() => {
          if (deletingDoctor) {
            deleteDoctorMutation.mutate(deletingDoctor.id);
          }
        }}
      />
    </div>
  );
}

export default function DoctorsManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-xs font-medium">Loading Doctors Management...</p>
        </div>
      }
    >
      <DoctorsManagementContent />
    </Suspense>
  );
}
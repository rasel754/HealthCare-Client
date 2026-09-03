"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMeService } from "@/src/services/auth.services";
import { updateDoctorService } from "@/src/services/doctor.services";
import { updateMyProfileService } from "@/src/services/patient.services";
import { updateAdminService, updateSuperAdminService } from "@/src/services/admin.services";
import { getSpecialtiesService } from "@/src/services/specialty.services";
import { Role, Gender, BloodGroup, MaritalStatus, IUser } from "@/src/types/auth.type";
import { ISpecialty } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ClinicalProfileSkeleton } from "@/src/components/shared/ClinicalSkeleton";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Camera,
  Stethoscope,
  Award,
  Building2,
  Hash,
  Star,
  Activity,
  Calendar,
  DollarSign,
  ShieldCheck,
  Edit3,
  X,
  FileText,
  UploadCloud,
  Clock,
  Sparkles,
  HeartPulse,
} from "lucide-react";

export default function MyProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // View or Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch Current User
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMeService(),
  });

  // Fetch Available Specialties for Doctor selection
  const { data: specialtiesResponse } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => getSpecialtiesService(),
  });

  const availableSpecialties: ISpecialty[] =
    specialtiesResponse && "data" in specialtiesResponse && Array.isArray(specialtiesResponse.data)
      ? specialtiesResponse.data
      : [];

  const user = (userResponse && "data" in userResponse ? userResponse.data : null) as IUser | null;
  const doctor = user?.doctor;
  const patient = user?.patient;
  const admin = user?.admin;
  const superAdmin = user?.superAdmin;
  const role = user?.role;

  // Form States - Shared
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Doctor Form States
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [currentWorkingPlace, setCurrentWorkingPlace] = useState("");
  const [experience, setExperience] = useState<number>(0);
  const [appointmentFee, setAppointmentFee] = useState<number>(0);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<string[]>([]);

  // Patient Form States
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(BloodGroup.O_POSITIVE);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(MaritalStatus.UNMARRIED);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [medicalReportFiles, setMedicalReportFiles] = useState<FileList | null>(null);

  // Synchronize form states whenever user data changes
  useEffect(() => {
    if (!user) return;

    if (role === Role.DOCTOR && doctor) {
      setName(doctor.name || user.name || "");
      setContactNumber(doctor.contactNumber || user.contactNumber || "");
      setAddress(doctor.address || user.address || "");
      setRegistrationNumber(doctor.registrationNumber || "");
      setQualification(doctor.qualification || "");
      setDesignation(doctor.designation || "");
      setCurrentWorkingPlace(doctor.currentWorkingPlace || "");
      setExperience(doctor.experience ?? 0);
      setAppointmentFee(doctor.appointmentFee ?? 0);
      setGender((doctor.gender as Gender) || Gender.MALE);

      const specIds =
        doctor.specialties?.map((s: any) => s.specialtyId || s.specialty?.id || s.id || s).filter(Boolean) || [];
      setSelectedSpecialtyIds(specIds);
      setPhotoPreview(doctor.profilePhoto || user.image || null);
    } else if (role === Role.PATIENT && patient) {
      setName(patient.name || user.name || "");
      setContactNumber(patient.contactNumber || user.contactNumber || "");
      setAddress(patient.address || user.address || "");
      setPhotoPreview(patient.profilePhoto || user.image || null);

      if (patient.patientHealthData) {
        setGender((patient.patientHealthData.gender as Gender) || Gender.MALE);
        setBloodGroup((patient.patientHealthData.bloodGroup as BloodGroup) || BloodGroup.O_POSITIVE);
        setDateOfBirth(patient.patientHealthData.dateOfBirth ? patient.patientHealthData.dateOfBirth.split("T")[0] : "");
        setHeight(patient.patientHealthData.height || "");
        setWeight(patient.patientHealthData.weight || "");
        setMaritalStatus((patient.patientHealthData.maritalStatus as MaritalStatus) || MaritalStatus.UNMARRIED);
        setHasAllergies(Boolean(patient.patientHealthData.hasAllergies));
        setHasDiabetes(Boolean(patient.patientHealthData.hasDiabetes));
      }
    } else if (role === Role.SUPER_ADMIN) {
      const adminData = superAdmin || admin;
      setName(adminData?.name || user.name || "");
      setContactNumber(adminData?.contactNumber || user.contactNumber || "");
      setAddress(user.address || "");
      setPhotoPreview(adminData?.profilePhoto || user.image || null);
    } else if (role === Role.ADMIN) {
      const adminData = admin || superAdmin;
      setName(adminData?.name || user.name || "");
      setContactNumber(adminData?.contactNumber || user.contactNumber || "");
      setAddress(user.address || "");
      setPhotoPreview(adminData?.profilePhoto || user.image || null);
    } else {
      setName(user.name || "");
      setContactNumber(user.contactNumber || "");
      setAddress(user.address || "");
      setPhotoPreview(user.image || null);
    }
  }, [user, role, doctor, patient, admin, superAdmin]);

  // Handle Photo File Selection & Preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Profile photo size must be less than 5MB");
        return;
      }
      setSelectedPhotoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
    }
  };

  // Toggle Specialty in Doctor Multi-select
  const toggleSpecialty = (specId: string) => {
    setSelectedSpecialtyIds((prev) =>
      prev.includes(specId) ? prev.filter((id) => id !== specId) : [...prev, specId]
    );
  };

  // Mutations
  const updateDoctorMutation = useMutation({
    mutationFn: (formData: FormData) => updateDoctorService(doctor?.id || user?.id || "", formData),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg("Doctor profile updated successfully!");
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ["me"] });
        queryClient.invalidateQueries({ queryKey: ["doctors"] });
      }
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to update profile"),
  });

  const updatePatientMutation = useMutation({
    mutationFn: (formData: FormData) => updateMyProfileService(formData),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg("Patient profile & health data updated successfully!");
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to update profile"),
  });

  const updateAdminMutation = useMutation({
    mutationFn: (formData: FormData) =>
      updateAdminService(admin?.id || superAdmin?.id || user?.id || "", formData),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg("Admin profile updated successfully!");
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to update profile"),
  });

  const updateSuperAdminMutation = useMutation({
    mutationFn: (formData: FormData) =>
      updateSuperAdminService(superAdmin?.id || admin?.id || user?.id || "", formData),
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg("Super Admin profile updated successfully!");
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to update profile"),
  });

  const isSaving =
    updateDoctorMutation.isPending ||
    updatePatientMutation.isPending ||
    updateAdminMutation.isPending ||
    updateSuperAdminMutation.isPending;

  // Submit Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();

    if (selectedPhotoFile) {
      formData.append("profilePhoto", selectedPhotoFile);
    }

    if (role === Role.DOCTOR) {
      if (selectedSpecialtyIds.length === 0) {
        setErrorMsg("Please select at least one medical specialty.");
        return;
      }
      const dataPayload = {
        name,
        contactNumber,
        address,
        registrationNumber,
        qualification,
        designation,
        currentWorkingPlace,
        experience: Number(experience),
        appointmentFee: Number(appointmentFee),
        gender,
        specialties: selectedSpecialtyIds,
      };
      formData.append("data", JSON.stringify(dataPayload));
      updateDoctorMutation.mutate(formData);
    } else if (role === Role.PATIENT) {
      if (medicalReportFiles) {
        Array.from(medicalReportFiles).forEach((file) => {
          formData.append("medicalReports", file);
        });
      }
      const dataPayload = {
        patientInfo: {
          ...(name ? { name } : {}),
          ...(contactNumber ? { contactNumber } : {}),
          ...(address ? { address } : {}),
        },
        patientHealthData: {
          gender,
          ...(dateOfBirth ? { dateOfBirth } : {}),
          bloodGroup,
          ...(height ? { height } : {}),
          ...(weight ? { weight } : {}),
          maritalStatus,
          hasAllergies,
          hasDiabetes,
        },
      };
      formData.append("data", JSON.stringify(dataPayload));
      updatePatientMutation.mutate(formData);
    } else if (role === Role.ADMIN) {
      const dataPayload = {
        name,
        contactNumber,
      };
      formData.append("data", JSON.stringify(dataPayload));
      updateAdminMutation.mutate(formData);
    } else if (role === Role.SUPER_ADMIN) {
      const dataPayload = {
        name,
        contactNumber,
      };
      formData.append("data", JSON.stringify(dataPayload));
      updateSuperAdminMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Account Profile</h1>
          <p className="text-xs text-muted-foreground mt-1">Authenticated user credentials and system account status</p>
        </div>
        <ClinicalProfileSkeleton />
      </div>
    );
  }

  // Active current profile photo URL
  const currentPhotoUrl =
    photoPreview ||
    doctor?.profilePhoto ||
    patient?.profilePhoto ||
    admin?.profilePhoto ||
    superAdmin?.profilePhoto ||
    user?.image;

  // Normalized specialties for Doctor read view
  const doctorSpecialties: ISpecialty[] =
    doctor?.specialties?.map((s: any) => (s.specialty ? s.specialty : s)) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            {role === Role.DOCTOR
              ? "Doctor Profile & Clinical Credentials"
              : role === Role.PATIENT
              ? "Patient Health Profile"
              : role === Role.SUPER_ADMIN
              ? "Super Admin Account & Clearance"
              : "Admin Account & Security Profile"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your authenticated personal information, credentials, and profile image
          </p>
        </div>

        <Button
          onClick={() => {
            setIsEditing(!isEditing);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          variant={isEditing ? "outline" : "default"}
          className="rounded-2xl gap-2 font-semibold shadow-xs"
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" /> Cancel Editing
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4" /> Edit Profile Details
            </>
          )}
        </Button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-card text-card-foreground rounded-3xl border border-border overflow-hidden shadow-xs">
        {/* Banner Strip */}
        <div className="h-28 bg-gradient-to-r from-primary/80 via-primary to-indigo-600/90 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-background/85 backdrop-blur-md text-foreground text-xs font-extrabold px-3 py-1 rounded-full uppercase shadow-xs border border-border">
              {user?.role}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase backdrop-blur-md shadow-xs ${
                user?.status === "ACTIVE"
                  ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/40"
                  : "bg-rose-500/20 text-rose-100 border border-rose-400/40"
              }`}
            >
              {user?.status}
            </span>
          </div>
        </div>

        {/* Profile Avatar & User Quick Title */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
            <div className="flex items-end gap-5">
              <div className="relative group">
                <div className="h-28 w-28 rounded-3xl bg-card border-4 border-card text-primary flex items-center justify-center font-bold text-4xl shadow-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/25">
                  {currentPhotoUrl ? (
                    <img
                      src={currentPhotoUrl}
                      alt={user?.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user?.name ? user.name[0].toUpperCase() : "U"}</span>
                  )}
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs"
                    title="Upload new profile picture"
                  >
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-[11px] font-bold">Change</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-foreground">{user?.name}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="h-3.5 w-3.5 text-primary" /> {user?.email}
                  </span>
                  {user?.emailVerified && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isEditing && selectedPhotoFile && (
              <div className="text-xs bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-xl flex items-center gap-2 font-semibold">
                <Camera className="h-4 w-4" /> Ready to upload: {selectedPhotoFile.name}
              </div>
            )}
          </div>

          {/* Quick Metrics Cards */}
          {role === Role.DOCTOR && doctor && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center space-y-1">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Experience</p>
                <p className="text-xl font-black text-primary">{doctor.experience || 0} Years</p>
              </div>
              <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center space-y-1">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Consultation Fee</p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ${doctor.appointmentFee || 0}
                </p>
              </div>
              <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center space-y-1">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Average Rating</p>
                <div className="flex items-center justify-center gap-1 text-xl font-black text-amber-500">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span>{doctor.averageRating ? doctor.averageRating.toFixed(1) : "5.0"}</span>
                </div>
              </div>
              <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center space-y-1">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Specialties</p>
                <p className="text-xl font-black text-foreground">{doctorSpecialties.length}</p>
              </div>
            </div>
          )}

          {role === Role.PATIENT && patient && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center space-y-1">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Blood Group</p>
                <p className="text-xl font-black text-rose-600 dark:text-rose-400">
                  {patient.patientHealthData?.bloodGroup?.replace("_", " ") || "Not set"}
                </p>
              </div>
              <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center space-y-1">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Gender</p>
                <p className="text-xl font-black text-primary capitalize">
                  {patient.patientHealthData?.gender || "Not set"}
                </p>
              </div>
              <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center space-y-1">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Marital Status</p>
                <p className="text-xl font-black text-foreground capitalize">
                  {patient.patientHealthData?.maritalStatus?.toLowerCase() || "Single"}
                </p>
              </div>
              <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl text-center space-y-1">
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Reports Uploaded</p>
                <p className="text-xl font-black text-foreground">
                  {patient.medicalReports?.length || 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODE: COMPREHENSIVE ROLE DETAILS */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* DOCTOR VIEW DETAILS */}
          {role === Role.DOCTOR && doctor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional Credentials Card */}
              <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Professional Credentials</h3>
                    <p className="text-xs text-muted-foreground">Doctor registration, designation & workplace</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-primary" /> Medical Reg. No
                    </span>
                    <span className="font-semibold text-foreground">{doctor.registrationNumber || "N/A"}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-primary" /> Designation
                    </span>
                    <span className="font-semibold text-foreground text-right">{doctor.designation || "N/A"}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" /> Qualifications
                    </span>
                    <span className="font-semibold text-foreground text-right">{doctor.qualification || "N/A"}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-primary" /> Current Workplace
                    </span>
                    <span className="font-semibold text-foreground text-right">
                      {doctor.currentWorkingPlace || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" /> Clinical Experience
                    </span>
                    <span className="font-semibold text-foreground">{doctor.experience || 0} Years</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-primary" /> Consultation Fee
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ${doctor.appointmentFee || 0} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Contact & Chamber Address */}
              <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Contact & Personal Details</h3>
                    <p className="text-xs text-muted-foreground">Phone, chamber location and gender</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
                    </span>
                    <span className="font-semibold text-foreground">{doctor.contactNumber || user?.contactNumber || "N/A"}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Chamber / Address
                    </span>
                    <span className="font-semibold text-foreground text-right">{doctor.address || user?.address || "N/A"}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" /> Gender
                    </span>
                    <span className="font-semibold text-foreground capitalize">{doctor.gender || "N/A"}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" /> Email Account
                    </span>
                    <span className="font-semibold text-foreground truncate">{doctor.email || user?.email}</span>
                  </div>
                </div>

                {/* Assigned Medical Specialties Badges */}
                <div className="pt-4 border-t border-border space-y-2">
                  <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Medical Specialties
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {doctorSpecialties.length === 0 ? (
                      <span className="text-xs text-muted-foreground italic">No specialties assigned yet</span>
                    ) : (
                      doctorSpecialties.map((spec, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-xl"
                        >
                          {spec.title}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PATIENT VIEW DETAILS */}
          {role === Role.PATIENT && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Health Metrics */}
              <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Clinical Health Metrics</h3>
                    <p className="text-xs text-muted-foreground">Physical attributes and medical background</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Blood Group</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {patient?.patientHealthData?.bloodGroup?.replace("_", " ") || "Not set"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Date of Birth</span>
                    <span className="font-semibold text-foreground">
                      {patient?.patientHealthData?.dateOfBirth
                        ? new Date(patient.patientHealthData.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Height & Weight</span>
                    <span className="font-semibold text-foreground">
                      {patient?.patientHealthData?.height || "N/A"} / {patient?.patientHealthData?.weight || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Has Allergies</span>
                    <span
                      className={`font-bold ${
                        patient?.patientHealthData?.hasAllergies ? "text-amber-500" : "text-emerald-500"
                      }`}
                    >
                      {patient?.patientHealthData?.hasAllergies ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Has Diabetes</span>
                    <span
                      className={`font-bold ${
                        patient?.patientHealthData?.hasDiabetes ? "text-amber-500" : "text-emerald-500"
                      }`}
                    >
                      {patient?.patientHealthData?.hasDiabetes ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Contact Info */}
              <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Contact & Address</h3>
                    <p className="text-xs text-muted-foreground">Residential address and contact telephone</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
                    </span>
                    <span className="font-semibold text-foreground">
                      {patient?.contactNumber || user?.contactNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Residential Address
                    </span>
                    <span className="font-semibold text-foreground text-right">
                      {patient?.address || user?.address || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" /> Registered Email
                    </span>
                    <span className="font-semibold text-foreground truncate">{user?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN & SUPER ADMIN VIEW DETAILS */}
          {(role === Role.ADMIN || role === Role.SUPER_ADMIN) && (
            <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 space-y-5 shadow-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Administrative Profile & Clearance</h3>
                  <p className="text-xs text-muted-foreground">System level credentials, security and access status</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Full Name</p>
                  <p className="font-semibold text-foreground text-base">{user?.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Official Email</p>
                  <p className="font-semibold text-foreground text-base">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Phone Number</p>
                  <p className="font-semibold text-foreground text-base">
                    {admin?.contactNumber || superAdmin?.contactNumber || user?.contactNumber || "Not provided"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Security Role Clearance</p>
                  <p className="font-extrabold text-primary text-base uppercase">{user?.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* EDIT MODE: LIVE EDIT FORM WITH IMAGE UPLOAD */
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-card text-card-foreground rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Edit Your Profile</h3>
                  <p className="text-xs text-muted-foreground">
                    Update your account details and upload a high-resolution profile picture
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
            </div>

            {/* Profile Photo File Upload Section */}
            <div className="p-4 bg-muted/40 border border-border rounded-2xl flex flex-col sm:flex-row items-center gap-5">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <p className="text-sm font-bold text-foreground">Upload Profile Photo</p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, WEBP. Max file size: 5MB.
                </p>
                <div className="pt-1 flex items-center gap-2 justify-center sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl text-xs h-8 font-semibold gap-1.5 cursor-pointer"
                  >
                    <UploadCloud className="h-3.5 w-3.5" /> Choose New Picture
                  </Button>
                  {selectedPhotoFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPhotoFile(null);
                        setPhotoPreview(user?.image || doctor?.profilePhoto || null);
                      }}
                      className="rounded-xl text-xs h-8 text-destructive"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* General Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase">Full Name *</Label>
                <Input
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl mt-1.5 bg-background border-input font-medium"
                />
              </div>

              <div>
                <Label className="text-xs font-bold uppercase">Contact Phone Number *</Label>
                <Input
                  required
                  placeholder="e.g. +1234567890"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="rounded-xl mt-1.5 bg-background border-input font-medium"
                />
              </div>
            </div>

            {/* DOCTOR SPECIFIC EDIT FIELDS */}
            {role === Role.DOCTOR && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase">Chamber / Practice Address</Label>
                    <Input
                      placeholder="Clinic / Chamber address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase">Medical Registration Number *</Label>
                    <Input
                      required
                      placeholder="e.g. MED-884920"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase">Qualifications *</Label>
                    <Input
                      required
                      placeholder="e.g. MBBS, FCPS, MD, MRCP"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase">Designation *</Label>
                    <Input
                      required
                      placeholder="e.g. Senior Consultant Cardiologist"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase">Current Working Place / Hospital *</Label>
                    <Input
                      required
                      placeholder="e.g. City General Hospital"
                      value={currentWorkingPlace}
                      onChange={(e) => setCurrentWorkingPlace(e.target.value)}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase">Gender *</Label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="w-full h-10 px-3 border border-input bg-background text-foreground rounded-xl text-sm font-medium mt-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={Gender.MALE}>Male</option>
                      <option value={Gender.FEMALE}>Female</option>
                      <option value={Gender.OTHER}>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase">Experience in Years *</Label>
                    <Input
                      required
                      type="number"
                      min={0}
                      placeholder="e.g. 8"
                      value={experience}
                      onChange={(e) => setExperience(Number(e.target.value))}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase">Consultation Fee ($ USD) *</Label>
                    <Input
                      required
                      type="number"
                      min={0}
                      placeholder="e.g. 50"
                      value={appointmentFee}
                      onChange={(e) => setAppointmentFee(Number(e.target.value))}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>
                </div>

                {/* Specialties Multi-Select */}
                <div className="space-y-2 pt-2">
                  <Label className="text-xs font-bold uppercase">
                    Select Assigned Medical Specialties * ({selectedSpecialtyIds.length} selected)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 bg-muted/20 border border-border rounded-2xl">
                    {availableSpecialties.map((spec) => {
                      const isSelected = selectedSpecialtyIds.includes(spec.id);
                      return (
                        <button
                          key={spec.id}
                          type="button"
                          onClick={() => toggleSpecialty(spec.id)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-card text-foreground border-border hover:bg-accent"
                          }`}
                        >
                          <span className="truncate">{spec.title}</span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* PATIENT SPECIFIC EDIT FIELDS */}
            {role === Role.PATIENT && (
              <>
                <div>
                  <Label className="text-xs font-bold uppercase">Residential Address</Label>
                  <Input
                    placeholder="Home address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded-xl mt-1.5 bg-background border-input font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase">Blood Group</Label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                      className="w-full h-10 px-3 border border-input bg-background text-foreground rounded-xl text-sm font-medium mt-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {Object.values(BloodGroup).map((bg) => (
                        <option key={bg} value={bg}>
                          {bg.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase">Gender</Label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="w-full h-10 px-3 border border-input bg-background text-foreground rounded-xl text-sm font-medium mt-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={Gender.MALE}>Male</option>
                      <option value={Gender.FEMALE}>Female</option>
                      <option value={Gender.OTHER}>Other</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase">Date of Birth</Label>
                    <Input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase">Height</Label>
                    <Input
                      placeholder="e.g. 5 ft 10 in"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase">Weight</Label>
                    <Input
                      placeholder="e.g. 72 kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="rounded-xl mt-1.5 bg-background border-input font-medium"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase">Marital Status</Label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                      className="w-full h-10 px-3 border border-input bg-background text-foreground rounded-xl text-sm font-medium mt-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {Object.values(MaritalStatus).map((ms) => (
                        <option key={ms} value={ms}>
                          {ms}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3.5 border border-border rounded-2xl bg-muted/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAllergies}
                      onChange={(e) => setHasAllergies(e.target.checked)}
                      className="h-4 w-4 rounded text-primary"
                    />
                    <span className="text-sm font-semibold text-foreground">Has Allergies</span>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 border border-border rounded-2xl bg-muted/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasDiabetes}
                      onChange={(e) => setHasDiabetes(e.target.checked)}
                      className="h-4 w-4 rounded text-primary"
                    />
                    <span className="text-sm font-semibold text-foreground">Has Diabetes</span>
                  </label>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold uppercase">Upload New Medical Reports (PDF / Images)</Label>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    onChange={(e) => setMedicalReportFiles(e.target.files)}
                    className="rounded-xl bg-background border-input font-medium"
                  />
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-2xl h-11 px-6 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-2xl h-11 px-8 font-bold shadow-md shadow-primary/20"
              >
                {isSaving ? "Saving Profile..." : "Save & Update Information"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
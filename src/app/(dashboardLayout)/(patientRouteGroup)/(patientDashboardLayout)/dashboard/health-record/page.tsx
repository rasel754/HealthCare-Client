"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMeService } from "@/src/services/auth.services";
import { updateMyProfileService } from "@/src/services/patient.services";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Gender, BloodGroup, MaritalStatus } from "@/src/types/auth.type";
import { User, Phone, MapPin, Activity, FileUp, CheckCircle2, AlertCircle } from "lucide-react";

export default function HealthRecordPage() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getMeService(),
  });

  const user = userResponse && "data" in userResponse ? userResponse.data : null;

  // Form State
  const [name, setName] = useState(user?.name || "");
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [gender, setGender] = useState<string>(Gender.MALE);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState<string>(BloodGroup.O_POSITIVE);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [maritalStatus, setMaritalStatus] = useState<string>(MaritalStatus.UNMARRIED);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [medicalReportFiles, setMedicalReportFiles] = useState<FileList | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfileService,
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg("Health profile & records updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
    onError: (err: any) => setErrorMsg(err.message || "Failed to update profile"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    if (medicalReportFiles) {
      Array.from(medicalReportFiles).forEach((file) => {
        formData.append("medicalReports", file);
      });
    }

    formData.append(
      "patientInfo",
      JSON.stringify({
        name,
        contactNumber,
        address,
      })
    );

    formData.append(
      "patientHealthData",
      JSON.stringify({
        gender,
        dateOfBirth,
        bloodGroup,
        height,
        weight,
        maritalStatus,
        hasAllergies,
        hasDiabetes,
      })
    );

    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-slate-500">Loading health record...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Health Profile & Medical Records</h1>
        <p className="text-xs text-slate-500 mt-1">Keep your personal health metrics and diagnostic reports updated</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 space-y-8 shadow-xs">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="rounded-xl mt-1" />
            </div>
          </div>

          <div>
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-xl mt-1" />
          </div>
        </div>

        {/* Health Data */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" /> Health Metrics & Vitals
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Gender</Label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium mt-1"
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="rounded-xl mt-1" />
            </div>

            <div>
              <Label>Blood Group</Label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium mt-1"
              >
                {Object.values(BloodGroup).map((bg) => (
                  <option key={bg} value={bg}>
                    {bg.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Height (cm)</Label>
              <Input placeholder="175 cm" value={height} onChange={(e) => setHeight(e.target.value)} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input placeholder="70 kg" value={weight} onChange={(e) => setWeight(e.target.value)} className="rounded-xl mt-1" />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAllergies}
                onChange={(e) => setHasAllergies(e.target.checked)}
                className="rounded text-primary focus:ring-primary h-4 w-4"
              />
              Has Allergies
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDiabetes}
                onChange={(e) => setHasDiabetes(e.target.checked)}
                className="rounded text-primary focus:ring-primary h-4 w-4"
              />
              Has Diabetes
            </label>
          </div>
        </div>

        {/* File Uploads */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileUp className="h-5 w-5 text-blue-600" /> Upload Profile Photo & Medical Reports
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Profile Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label>Medical Reports (PDF / Images, Max 5)</Label>
              <Input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={(e) => setMedicalReportFiles(e.target.files)}
                className="rounded-xl mt-1"
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={updateProfileMutation.isPending} className="rounded-xl px-8 h-11">
          {updateProfileMutation.isPending ? "Saving Changes..." : "Save Health Profile"}
        </Button>
      </form>
    </div>
  );
}
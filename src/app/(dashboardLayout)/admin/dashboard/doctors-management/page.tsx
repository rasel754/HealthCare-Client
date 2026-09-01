"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDoctorsService, createDoctorService, updateDoctorService, deleteDoctorService } from "@/src/services/doctor.services";
import { getSpecialtiesService } from "@/src/services/specialty.services";
import { IDoctor, ISpecialty } from "@/src/types/domain.types";
import { Gender } from "@/src/types/auth.type";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Stethoscope, Plus, Search, Trash2, Edit, X } from "lucide-react";

export default function DoctorsManagementPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<IDoctor | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Form State for creating doctor
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
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
  const [editRegNum, setEditRegNum] = useState("");
  const [editQual, setEditQual] = useState("");
  const [editDesig, setEditDesig] = useState("");
  const [editWorkPlace, setEditWorkPlace] = useState("");
  const [editFee, setEditFee] = useState<number>(50);
  const [editExp, setEditExp] = useState<number>(5);
  const [editGender, setEditGender] = useState<Gender>(Gender.MALE);

  const { data: specialtiesResponse } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => getSpecialtiesService(),
  });

  const { data: doctorsResponse, isLoading } = useQuery({
    queryKey: ["doctors", searchTerm],
    queryFn: () => getDoctorsService({ searchTerm: searchTerm || undefined, limit: 50 }),
  });

  const specialties = (specialtiesResponse && "data" in specialtiesResponse ? specialtiesResponse.data : []) as ISpecialty[];
  const doctors = (doctorsResponse && "data" in doctorsResponse ? doctorsResponse.data : []) as IDoctor[];

  const createDoctorMutation = useMutation({
    mutationFn: createDoctorService,
    onSuccess: (res) => {
      if ("success" in res && !res.success) {
        setMsg(res.message);
      } else {
        setMsg("Doctor account created successfully!");
        setTimeout(() => {
          setIsAddModalOpen(false);
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctors"] }),
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    createDoctorMutation.mutate({
      password,
      doctor: {
        name,
        email,
        contactNumber,
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
    setEditRegNum(doc.registrationNumber || "");
    setEditQual(doc.qualification || "");
    setEditDesig(doc.designation || "");
    setEditWorkPlace(doc.currentWorkingPlace || "");
    setEditFee(doc.appointmentFee || 50);
    setEditExp(doc.experience || 5);
    setEditGender(doc.gender || Gender.MALE);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    setMsg(null);
    updateDoctorMutation.mutate({
      id: editingDoctor.id,
      payload: {
        name: editName,
        contactNumber: editContact,
        registrationNumber: editRegNum,
        qualification: editQual,
        designation: editDesig,
        currentWorkingPlace: editWorkPlace,
        appointmentFee: Number(editFee),
        experience: Number(editExp),
        gender: editGender,
      },
    });
  };

  const toggleSpecialtySelect = (id: string) => {
    if (selectedSpecialtyIds.includes(id)) {
      setSelectedSpecialtyIds(selectedSpecialtyIds.filter((item) => item !== id));
    } else {
      setSelectedSpecialtyIds([...selectedSpecialtyIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctors Directory Management</h1>
          <p className="text-xs text-slate-500 mt-1">Add, update credentials, and manage system doctor accounts</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl gap-2 h-11 px-5 shadow-sm">
          <Plus className="h-4 w-4" /> Add Doctor Account
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by doctor name or registration number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-white"
        />
      </div>

      {/* Doctor Cards */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading doctor accounts...</div>
      ) : doctors.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <Stethoscope className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Doctors Registered</h3>
          <p className="text-xs text-slate-400">Click &apos;Add Doctor Account&apos; above to onboard specialist doctors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                      {doc.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                      <p className="text-xs text-primary font-semibold">{doc.designation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(doc)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Edit Doctor Profile"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteDoctorMutation.mutate(doc.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Doctor Account"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl space-y-1 text-xs text-slate-600">
                  <p><strong>Email:</strong> {doc.email}</p>
                  <p><strong>Reg #:</strong> {doc.registrationNumber}</p>
                  <p><strong>Working Place:</strong> {doc.currentWorkingPlace}</p>
                  <p><strong>Fee:</strong> ${doc.appointmentFee}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xl">Create Doctor Account</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {msg && <div className="p-3 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">{msg}</div>}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Doctor Name</Label>
                  <Input required placeholder="Dr. Jane Smith" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input required type="email" placeholder="jane@healthcare.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Password</Label>
                  <Input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <Input required placeholder="+8801700000000" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="rounded-xl mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Registration Number</Label>
                  <Input required placeholder="REG-10928" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Qualification</Label>
                  <Input required placeholder="MBBS, FCPS" value={qualification} onChange={(e) => setQualification(e.target.value)} className="rounded-xl mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Designation</Label>
                  <Input required placeholder="Consultant Cardiologist" value={designation} onChange={(e) => setDesignation(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Current Working Place</Label>
                  <Input required placeholder="Square Hospital" value={currentWorkingPlace} onChange={(e) => setCurrentWorkingPlace(e.target.value)} className="rounded-xl mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Appointment Fee ($)</Label>
                  <Input required type="number" value={appointmentFee} onChange={(e) => setAppointmentFee(Number(e.target.value))} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Experience (Years)</Label>
                  <Input required type="number" value={experience} onChange={(e) => setExperience(Number(e.target.value))} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium mt-1"
                  >
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Assign Medical Specialties</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                  {specialties.map((s) => {
                    const isSelected = selectedSpecialtyIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSpecialtySelect(s.id)}
                        className={`p-2 rounded-xl border text-xs text-left transition-all ${
                          isSelected ? "border-primary bg-primary/10 font-bold text-primary" : "border-slate-200 bg-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xl">Edit Doctor Profile</h3>
              <button onClick={() => setEditingDoctor(null)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {msg && <div className="p-3 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">{msg}</div>}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Doctor Name</Label>
                  <Input required value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <Input required value={editContact} onChange={(e) => setEditContact(e.target.value)} className="rounded-xl mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Registration Number</Label>
                  <Input required value={editRegNum} onChange={(e) => setEditRegNum(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Qualification</Label>
                  <Input required value={editQual} onChange={(e) => setEditQual(e.target.value)} className="rounded-xl mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Designation</Label>
                  <Input required value={editDesig} onChange={(e) => setEditDesig(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Current Working Place</Label>
                  <Input required value={editWorkPlace} onChange={(e) => setEditWorkPlace(e.target.value)} className="rounded-xl mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Appointment Fee ($)</Label>
                  <Input required type="number" value={editFee} onChange={(e) => setEditFee(Number(e.target.value))} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Experience (Years)</Label>
                  <Input required type="number" value={editExp} onChange={(e) => setEditExp(Number(e.target.value))} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as Gender)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium mt-1"
                  >
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                  </select>
                </div>
              </div>

              <Button type="submit" disabled={updateDoctorMutation.isPending} className="w-full rounded-xl mt-4 h-11 font-semibold">
                {updateDoctorMutation.isPending ? "Updating..." : "Save Doctor Profile"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
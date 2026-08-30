"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDoctorsService } from "@/src/services/doctor.services";
import { getSpecialtiesService } from "@/src/services/specialty.services";
import { IDoctor, ISpecialty } from "@/src/types/domain.types";
import { Gender } from "@/src/types/auth.type";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search, Stethoscope, Star, MapPin, Award, DollarSign, Calendar, Filter } from "lucide-react";
import BookAppointmentModal from "./BookAppointmentModal";

export default function DoctorList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [activeDoctorForBooking, setActiveDoctorForBooking] = useState<IDoctor | null>(null);

  const { data: specialtiesResponse } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => getSpecialtiesService(),
  });

  const { data: doctorsResponse, isLoading } = useQuery({
    queryKey: ["doctors", searchTerm, selectedGender, selectedSpecialty],
    queryFn: () =>
      getDoctorsService({
        searchTerm: searchTerm || undefined,
        gender: selectedGender || undefined,
        specialties: selectedSpecialty || undefined,
        limit: 20,
      }),
  });

  const specialties = (specialtiesResponse && "data" in specialtiesResponse ? specialtiesResponse.data : []) as ISpecialty[];
  const doctors = (doctorsResponse && "data" in doctorsResponse ? doctorsResponse.data : []) as IDoctor[];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Find & Book Specialist Doctors
        </h1>
        <p className="text-slate-500 text-sm">
          Browse top medical professionals, check real-time availability slots, and book instant consultations.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by doctor name, qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>

        <div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Specialties</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Any Gender</option>
            <option value={Gender.MALE}>Male Doctor</option>
            <option value={Gender.FEMALE}>Female Doctor</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Fetching verified doctor profiles...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Stethoscope className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            No doctor matches your current search criteria. Try resetting search filters or keywords.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedGender("");
              setSelectedSpecialty("");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden">
                    {doc.profilePhoto ? (
                      <img src={doc.profilePhoto} alt={doc.name} className="h-full w-full object-cover" />
                    ) : (
                      doc.name[0]
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-snug">{doc.name}</h3>
                    <p className="text-xs text-primary font-semibold">{doc.designation}</p>
                    <p className="text-xs text-slate-500 font-medium">{doc.qualification}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.currentWorkingPlace || "Central Hospital"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-slate-400" />
                      <span>{doc.experience || 0} Years Exp.</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      ★ {doc.averageRating ? doc.averageRating.toFixed(1) : "5.0"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Appointment Fee</p>
                  <p className="text-xl font-extrabold text-slate-900">${doc.appointmentFee}</p>
                </div>

                <Button
                  onClick={() => setActiveDoctorForBooking(doc)}
                  className="rounded-xl gap-2 text-xs font-semibold px-4 h-10 shadow-sm"
                >
                  <Calendar className="h-4 w-4" /> Book Slot
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {activeDoctorForBooking && (
        <BookAppointmentModal
          doctor={activeDoctorForBooking}
          onClose={() => setActiveDoctorForBooking(null)}
        />
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDoctorsService } from "@/src/services/doctor.services";
import { getSpecialtiesService } from "@/src/services/specialty.services";
import { IDoctor, ISpecialty } from "@/src/types/domain.types";
import { Gender } from "@/src/types/auth.type";
import { Button } from "@/src/components/ui/button";
import SearchAndFilterBar from "@/src/components/shared/SearchAndFilterBar";
import CardGrid from "@/src/components/shared/CardGrid";
import { Stethoscope, MapPin, Award, Calendar, ArrowRight } from "lucide-react";

export default function DoctorList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGender("");
    setSelectedSpecialty("");
  };

  const filtersConfig = [
    {
      id: "specialty",
      value: selectedSpecialty,
      placeholder: "All Specialties",
      options: specialties.map((s) => ({ label: s.title, value: s.id })),
      onChange: setSelectedSpecialty,
    },
    {
      id: "gender",
      value: selectedGender,
      placeholder: "Any Gender",
      options: [
        { label: "Male Doctor", value: Gender.MALE },
        { label: "Female Doctor", value: Gender.FEMALE },
      ],
      onChange: setSelectedGender,
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
          Find & Book Specialist Doctors
        </h1>
        <p className="text-muted-foreground text-sm">
          Browse top medical professionals, check real-time availability slots, and proceed to instant booking & checkout.
        </p>
      </div>

      {/* Reusable Search & Filter Bar */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by doctor name, qualification..."
        filters={filtersConfig}
        onClearFilters={handleClearFilters}
        hasActiveFilters={Boolean(searchTerm || selectedGender || selectedSpecialty)}
      />

      {/* Reusable Card Grid Component */}
      <CardGrid
        items={doctors}
        keyExtractor={(doc) => doc.id}
        isLoading={isLoading}
        loadingMessage="Fetching verified doctor profiles..."
        emptyTitle="No Doctors Found"
        emptyDescription="No doctor matches your current search criteria. Try resetting search filters or keywords."
        emptyIcon={<Stethoscope className="h-12 w-12 text-muted-foreground mx-auto" />}
        hasActiveFilters={Boolean(searchTerm || selectedGender || selectedSpecialty)}
        onClearFilters={handleClearFilters}
        renderCard={(doc) => (
          <div
            key={doc.id}
            className="bg-card text-card-foreground rounded-2xl border border-border p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 space-y-5 h-full"
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
                  <h3 className="font-bold text-foreground text-lg leading-snug">{doc.name}</h3>
                  <p className="text-xs text-primary font-semibold">{doc.designation}</p>
                  <p className="text-xs text-muted-foreground font-medium">{doc.qualification}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-foreground bg-accent/40 border border-border p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{doc.currentWorkingPlace || "Central Hospital"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{doc.experience || 0} Years Exp.</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    ★ {doc.averageRating ? doc.averageRating.toFixed(1) : "5.0"}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Appointment Fee</p>
                <p className="text-xl font-extrabold text-foreground">${doc.appointmentFee}</p>
              </div>

              <Button
                onClick={() => router.push(`/consultation/doctor/${doc.id}`)}
                className="rounded-xl gap-2 text-xs font-semibold px-4 h-10 shadow-sm"
              >
                <Calendar className="h-4 w-4" /> Book Slot <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
}
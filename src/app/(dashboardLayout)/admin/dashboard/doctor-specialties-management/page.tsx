"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDoctorsService } from "@/src/services/doctor.services";
import { IDoctor } from "@/src/types/domain.types";
import { Input } from "@/src/components/ui/input";
import { Layers, Search, Stethoscope, Award } from "lucide-react";

export default function DoctorSpecialtiesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: doctorsResponse, isLoading } = useQuery({
    queryKey: ["doctors-specialties", searchTerm],
    queryFn: () => getDoctorsService({ searchTerm: searchTerm || undefined, limit: 50 }),
  });

  const doctors = (doctorsResponse && "data" in doctorsResponse ? doctorsResponse.data : []) as IDoctor[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Doctor Medical Specialties Mapping</h1>
          <p className="text-xs text-muted-foreground mt-1">Review specialty tags assigned to registered doctors</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search doctor or specialty title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-background text-foreground border-input"
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">Loading doctor specialties mapping...</div>
      ) : doctors.length === 0 ? (
        <div className="bg-card text-card-foreground p-12 rounded-3xl border border-border text-center space-y-3 shadow-xs">
          <Layers className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No Specialty Mappings Found</h3>
          <p className="text-xs text-muted-foreground">Doctor specialty assignments will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => {
            const specialtiesList = doc.doctorSpecialties || [];

            return (
              <div key={doc.id} className="bg-card text-card-foreground rounded-3xl border border-border p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
                    {doc.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">{doc.name}</h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{doc.designation}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-primary" /> Tagged Specialties
                  </p>
                  {specialtiesList.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No specialties assigned.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {specialtiesList.map((ds) => (
                        <span
                          key={ds.specialtiesId}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20"
                        >
                          {ds.specialties?.title || "Specialty"}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
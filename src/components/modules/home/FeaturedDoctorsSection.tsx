"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDoctorsService } from "@/src/services/doctor.services";
import { IDoctor } from "@/src/types/domain.types";
import { Button } from "@/src/components/ui/button";
import { Stethoscope, Calendar, Award, MapPin, Star, ArrowRight, Sparkles } from "lucide-react";

const FALLBACK_DOCTORS: Array<Partial<IDoctor> & { id: string; name: string; designation: string; qualification: string; currentWorkingPlace: string; experience: number; appointmentFee: number; averageRating: number; specialtyTitle: string; profilePhoto?: string }> = [
  {
    id: "fb-1",
    name: "Dr. Sarah Jenkins",
    designation: "Chief Cardiologist",
    qualification: "MD, FACC - Harvard Medical",
    currentWorkingPlace: "Metropolitan Heart Center",
    experience: 14,
    appointmentFee: 65,
    averageRating: 4.9,
    specialtyTitle: "Cardiology",
    profilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: "fb-2",
    name: "Dr. Marcus Vance",
    designation: "Senior Neurologist",
    qualification: "MD, Ph.D. - Johns Hopkins",
    currentWorkingPlace: "Neuroscience Institute",
    experience: 11,
    appointmentFee: 80,
    averageRating: 5.0,
    specialtyTitle: "Neurology",
    profilePhoto: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: "fb-3",
    name: "Dr. Elena Rostova",
    designation: "Lead Pediatrician",
    qualification: "MBBS, DCH - Oxford University",
    currentWorkingPlace: "Children's Health Pavilion",
    experience: 9,
    appointmentFee: 50,
    averageRating: 4.8,
    specialtyTitle: "Pediatrics",
    profilePhoto: "https://images.unsplash.com/photo-1594824813589-3543d3b7654a?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: "fb-4",
    name: "Dr. Jonathan Davis",
    designation: "Orthopedic Surgeon",
    qualification: "MS (Ortho), FRCS",
    currentWorkingPlace: "Apex Bone & Joint Clinic",
    experience: 16,
    appointmentFee: 75,
    averageRating: 4.9,
    specialtyTitle: "Orthopedics",
    profilePhoto: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
  },
];

export default function FeaturedDoctorsSection() {
  const { data: doctorsResponse, isLoading } = useQuery({
    queryKey: ["featured-doctors"],
    queryFn: () => getDoctorsService({ limit: 4 }),
    staleTime: 1000 * 60 * 5,
  });

  const apiDoctors = (doctorsResponse && "data" in doctorsResponse && Array.isArray(doctorsResponse.data) ? doctorsResponse.data : []) as IDoctor[];
  const doctorsList = apiDoctors.length >= 2 ? apiDoctors.slice(0, 4) : FALLBACK_DOCTORS;

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/30 to-background border-t border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Top Medical Experts
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Consult with Verified Specialist Doctors
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Book real-time video consultations or physical hospital visits with board-certified physicians, surgeons, and specialists.
            </p>
          </div>

          <Link href="/consultation">
            <Button variant="outline" className="rounded-xl gap-2 font-semibold shadow-xs">
              View All Doctors <ArrowRight className="h-4 w-4 text-primary" />
            </Button>
          </Link>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctorsList.map((doc) => {
            const isFallback = doc.id.startsWith("fb-");
            const targetUrl = isFallback ? "/consultation" : `/consultation/doctor/${doc.id}`;
            const rating = doc.averageRating ? Number(doc.averageRating).toFixed(1) : "4.9";
            const specialtyName =
              doc.doctorSpecialties && doc.doctorSpecialties.length > 0 && doc.doctorSpecialties[0]?.specialties?.title
                ? doc.doctorSpecialties[0].specialties.title
                : (doc as any).specialtyTitle || "Specialist";

            return (
              <div
                key={doc.id}
                className="bg-card text-card-foreground rounded-3xl border border-border p-5 flex flex-col justify-between hover:shadow-xl hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Photo & Badge */}
                  <div className="relative aspect-square w-full rounded-2xl bg-muted/60 overflow-hidden border border-border flex items-center justify-center">
                    {doc.profilePhoto ? (
                      <img
                        src={doc.profilePhoto}
                        alt={doc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary/10 text-primary flex items-center justify-center font-bold text-4xl">
                        {doc.name ? doc.name[0] : <Stethoscope className="h-12 w-12" />}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-border text-xs font-bold flex items-center gap-1 text-amber-500 shadow-xs">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{rating}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-xs">
                      {specialtyName}
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors leading-tight">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-primary font-medium">{doc.designation}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{doc.qualification}</p>
                  </div>

                  {/* Meta stats */}
                  <div className="bg-muted/40 border border-border/80 rounded-xl p-3 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{doc.currentWorkingPlace || "Central Medical Hospital"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{doc.experience || 5}+ Years Experience</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-5 mt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Consult Fee</span>
                    <span className="text-lg font-extrabold text-foreground">${doc.appointmentFee || 50}</span>
                  </div>

                  <Link href={targetUrl}>
                    <Button size="sm" className="rounded-xl gap-1.5 text-xs font-semibold px-3.5 h-9 shadow-xs">
                      <Calendar className="h-3.5 w-3.5" /> Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

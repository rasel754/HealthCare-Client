"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Heart, Globe, Users, HandHeart, ShieldAlert, ArrowRight, Building2, CheckCircle2 } from "lucide-react";

interface NGOItem {
  id: string;
  name: string;
  category: string;
  location: string;
  impactMetric: string;
  description: string;
  tags: string[];
}

const FEATURED_NGOS: NGOItem[] = [
  {
    id: "rural-relief",
    name: "Rural Healthcare Relief Initiative",
    category: "Rural Outreach & Free Camps",
    location: "National Coverage",
    impactMetric: "24,000+ Patients Served",
    description: "Bringing mobile medical clinics, telemedicine pods, and essential pharmaceuticals to underserved rural villages.",
    tags: ["Mobile Clinics", "Free Checkups", "Emergency Care"],
  },
  {
    id: "child-care",
    name: "Child Immunization & Maternal Foundation",
    category: "Pediatric & Maternal Welfare",
    location: "Global Alliance",
    impactMetric: "18,500+ Vaccinations",
    description: "Protecting mothers and infants with fully subsidized prenatal checkups, pediatric vaccinations, and nutritional kits.",
    tags: ["Maternal Care", "Vaccinations", "Nutrition"],
  },
  {
    id: "cardiac-hope",
    name: "Heart Care Charity Network",
    category: "Subsidized Specialized Surgeries",
    location: "Metropolitan Hospitals",
    impactMetric: "$1.2M Grants Disbursed",
    description: "Partnering with tertiary hospitals to fund critical cardiac interventions and surgical treatments for low-income patients.",
    tags: ["Cardiac Surgeries", "Surgical Grants", "Specialist Care"],
  },
];

export default function PartnerNGOsSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-muted/30 via-background to-background border-t border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">
              <HandHeart className="h-4 w-4" /> Humanitarian Health Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Partner NGOs & Subsidized Healthcare
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              We collaborate with reputable humanitarian foundations and charitable NGOs to make quality healthcare accessible to every human being regardless of financial capability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/ngos">
              <Button className="rounded-xl gap-2 font-semibold shadow-sm bg-rose-600 hover:bg-rose-700 text-white">
                Apply for NGO Grant <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Impact Numbers Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="space-y-1 border-r border-border/60 pr-4 last:border-0">
            <p className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">$2.5M+</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Subsidized Medical Care</p>
          </div>
          <div className="space-y-1 sm:border-r border-border/60 pr-4 last:border-0">
            <p className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">65,000+</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Free Consultations Funded</p>
          </div>
          <div className="space-y-1 border-r border-border/60 pr-4 last:border-0">
            <p className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">120+</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Active NGO Partners</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">100%</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Transparent Verification</p>
          </div>
        </div>

        {/* NGO Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_NGOS.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-card text-card-foreground rounded-3xl border border-border p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-rose-500/40 transition-all duration-300 space-y-6"
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Globe className="h-7 w-7" />
                  </div>
                  <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold px-3 py-1 rounded-full border border-rose-500/20">
                    {ngo.impactMetric}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-primary">{ngo.category}</span>
                  <h3 className="font-bold text-foreground text-xl leading-snug">{ngo.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ngo.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ngo.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-muted/70 text-foreground/80 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-border/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{ngo.location}</span>
                </div>

                <Link href="/ngos">
                  <Button variant="ghost" size="sm" className="rounded-xl text-xs font-semibold gap-1 hover:text-rose-600">
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="bg-gradient-to-r from-rose-500/10 via-primary/5 to-emerald-500/10 border border-border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-foreground">Are you a registered healthcare NGO or non-profit?</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Join our network to sponsor patients, manage telemedicine medical drives, and distribute subsidized vouchers.
            </p>
          </div>
          <Link href="/ngos" className="shrink-0">
            <Button variant="outline" className="rounded-xl text-xs font-semibold h-11 px-6 shadow-xs border-foreground/20">
              Partner with HealthCare
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

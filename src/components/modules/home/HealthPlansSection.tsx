"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Check, HeartPulse, Sparkles, Shield, ArrowRight, Zap } from "lucide-react";

interface PlanItem {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
}

const HEALTH_PLANS: PlanItem[] = [
  {
    id: "individual",
    name: "Individual Care",
    monthlyPrice: 19,
    yearlyPrice: 190,
    description: "Essential healthcare protection for proactive individuals.",
    features: [
      "2 Free Video Consultations per month",
      "Unlimited 24/7 GP live chat support",
      "15% Discount on all Diagnostic tests",
      "Encrypted Digital Medical Locker",
      "Instant Electronic Prescription delivery",
    ],
  },
  {
    id: "family",
    name: "Family Protection",
    badge: "Most Popular",
    isPopular: true,
    monthlyPrice: 49,
    yearlyPrice: 490,
    description: "Complete health security covering up to 5 family members.",
    features: [
      "Coverage for up to 5 family members",
      "6 Free Specialist Video Consults / mo",
      "25% Discount on Diagnostics & Lab work",
      "Priority doctor slot booking queue",
      "Free Home Blood Sample Collection",
      "Dedicated Pediatric & Geriatric care line",
    ],
  },
  {
    id: "senior",
    name: "Senior & Chronic Care",
    badge: "Specialized",
    monthlyPrice: 79,
    yearlyPrice: 790,
    description: "Specialized care management for elderly and chronic conditions.",
    features: [
      "Unlimited General Physician Consults",
      "Assigned Personal Medical Care Officer",
      "Monthly comprehensive home vital checks",
      "35% Discount on Diagnostics & Pharmacy",
      "Emergency Ambulance priority dispatch",
      "Automated Medication refill alerts",
    ],
  },
];

export default function HealthPlansSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-20 lg:py-28 bg-background border-t border-border relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <HeartPulse className="h-4 w-4" /> Subscription Plans
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Affordable Health Protection <br className="hidden sm:inline" />
            <span className="text-primary">Tailored for Every Need</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Gain predictable healthcare costs with comprehensive coverage for consultations, diagnostic testing, and home health services.
          </p>

          {/* Billing Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="bg-muted p-1 rounded-2xl flex items-center border border-border shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {HEALTH_PLANS.map((plan) => {
            const price = billingCycle === "monthly" ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
            const periodText = billingCycle === "monthly" ? "/month" : "/mo (billed yearly)";

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? "bg-card border-2 border-primary shadow-2xl scale-[1.02] z-10"
                    : "bg-card border border-border shadow-sm hover:shadow-xl hover:border-border/80"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    {!plan.isPopular && plan.badge && (
                      <span className="inline-block text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md mb-2">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1.5 border-b border-border pb-6">
                    <span className="text-4xl sm:text-5xl font-black text-foreground">${price}</span>
                    <span className="text-xs text-muted-foreground font-medium">{periodText}</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What&apos;s Included:</p>
                    <ul className="space-y-3">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-foreground/90 font-medium">
                          <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan CTA */}
                <div className="pt-8 mt-6">
                  <Link href="/health-plans" className="block">
                    <Button
                      className={`w-full rounded-xl h-11 font-semibold text-sm shadow-sm ${
                        plan.isPopular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 shadow-lg"
                          : ""
                      }`}
                      variant={plan.isPopular ? "default" : "outline"}
                    >
                      <span>Choose {plan.name}</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Banner */}
        <div className="bg-muted/40 border border-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm sm:text-base">Need Custom Enterprise or Corporate Coverage?</h4>
              <p className="text-xs text-muted-foreground">Custom group plans available for teams of 10 to 5,000+ employees.</p>
            </div>
          </div>
          <Link href="/health-plans" className="shrink-0">
            <Button variant="secondary" className="rounded-xl text-xs font-semibold h-10 px-5 shadow-xs">
              Contact Enterprise Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

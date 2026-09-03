import { HeartPulse, Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function HealthPlansPage() {
  const plans = [
    { name: "Individual Care", price: "$19/mo", features: ["Unlimited GP Chat", "2 Free Video Consults/mo", "15% off Diagnostics"] },
    { name: "Family Health", price: "$49/mo", features: ["Up to 5 Family Members", "5 Free Video Consults/mo", "25% off Diagnostics", "Priority Doctor Slot"] },
    { name: "Senior Care", price: "$79/mo", features: ["Dedicated Medical Coordinator", "Home Blood Sampling", "Unlimited Video Consults", "Free Prescription Delivery"] },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
          <HeartPulse className="h-4 w-4" /> Subscription Plans
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Affordable Health Plans for Everyone
        </h1>
        <p className="text-muted-foreground text-sm">
          Save big on specialist doctor consultations, diagnostic tests, and prescription medicines with annual healthcare coverage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className="bg-card text-card-foreground rounded-3xl border border-border p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
              <p className="text-3xl font-extrabold text-primary mt-2">{p.price}</p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full rounded-xl h-11 shadow-sm">Subscribe Plan</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
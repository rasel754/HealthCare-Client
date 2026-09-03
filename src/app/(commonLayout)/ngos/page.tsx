import { Heart, Globe, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function NGOsPage() {
  const ngos = [
    { name: "Rural Healthcare Relief Initiative", focus: "Free Rural Health Camps", location: "National" },
    { name: "Child Immunization & Care Foundation", focus: "Pediatric & Maternal Care", location: "Global" },
    { name: "Heart Care Charity Network", focus: "Subsidized Cardiac Surgery", location: "Metropolitan" },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">
          <Heart className="h-4 w-4" /> Healthcare NGO Partners
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Subsidized & Free Healthcare Support
        </h1>
        <p className="text-muted-foreground text-sm">
          Partnering with humanitarian organizations to provide free medical consultations for underprivileged patients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ngos.map((ngo, idx) => (
          <div
            key={idx}
            className="bg-card text-card-foreground rounded-2xl border border-border p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-foreground text-lg">{ngo.name}</h3>
              <p className="text-xs text-muted-foreground font-medium">{ngo.focus}</p>
            </div>
            <Button variant="outline" className="w-full mt-6 rounded-xl shadow-xs">Apply for Financial Grant</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
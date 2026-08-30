import { Activity, TestTube, FileSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function DiagnosticsPage() {
  const tests = [
    { title: "Full Body Checkup", price: "$120", tests: "60+ Parameters included", popular: true },
    { title: "Complete Blood Count (CBC)", price: "$25", tests: "RBC, WBC, Hemoglobin, Platelets", popular: false },
    { title: "Lipid Profile & Heart Risk", price: "$45", tests: "Cholesterol, Triglycerides, HDL, LDL", popular: false },
    { title: "Diabetes Care Package", price: "$35", tests: "HbA1c, Fasting Blood Sugar, Insulin", popular: true },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
          <TestTube className="h-4 w-4" /> Diagnostic Lab Tests
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Home Sample Collection & Digital Reports
        </h1>
        <p className="text-slate-500 text-sm">
          Certified ISO & NABL diagnostic partners. Get accurate blood tests with instant digital reports directly in your HealthCare profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tests.map((t, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between relative shadow-xs">
            {t.popular && (
              <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Popular
              </span>
            )}
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <FileSearch className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{t.title}</h3>
              <p className="text-xs text-slate-500">{t.tests}</p>
              <p className="text-2xl font-extrabold text-slate-900">{t.price}</p>
            </div>
            <Button className="w-full mt-6 rounded-xl">Book Test Package</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
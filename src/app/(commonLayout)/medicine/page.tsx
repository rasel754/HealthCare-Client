import { Pill, Truck, ShieldCheck, ShoppingBag } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function MedicinePage() {
  const medicines = [
    { name: "Paracetamol 500mg", type: "Fever & Pain Relief", price: "$4.50" },
    { name: "Amoxicillin 250mg", type: "Antibiotic Capsule", price: "$12.00" },
    { name: "Omeprazole 20mg", type: "Gastric Care", price: "$8.20" },
    { name: "Multivitamin Extra", type: "Immunity Supplement", price: "$15.00" },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">
          <Pill className="h-4 w-4" /> Online Pharmacy Store
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          100% Genuine Prescription Medicines
        </h1>
        <p className="text-slate-500 text-sm">
          Order prescribed medicines directly from licensed pharmacies with fast home delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {medicines.map((m, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Pill className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{m.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{m.type}</p>
              <p className="text-xl font-extrabold text-slate-900">{m.price}</p>
            </div>
            <Button variant="outline" className="w-full mt-6 rounded-xl gap-2">
              <ShoppingBag className="h-4 w-4" /> Add to Order
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
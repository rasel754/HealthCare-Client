import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-slate-950 text-slate-200 mt-auto">
      <div className="container max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span>HealthCare</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering healthcare access through seamless digital doctor consultations, instant schedule booking, and secure medical records.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/consultation" className="hover:text-white transition-colors">Find a Doctor</Link></li>
              <li><Link href="/health-plans" className="hover:text-white transition-colors">Health Plans</Link></li>
              <li><Link href="/diagnostics" className="hover:text-white transition-colors">Diagnostics</Link></li>
              <li><Link href="/medicine" className="hover:text-white transition-colors">Medicine Store</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Specialties</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Orthopedics</li>
              <li>Pediatrics</li>
              <li>Dermatology</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact & Support</h4>
            <p className="text-sm text-slate-400 mb-2">Emergency Hotline: 16247</p>
            <p className="text-sm text-slate-400 mb-2">Email: support@healthcare.com</p>
            <p className="text-sm text-slate-400">Hours: 24/7 Available</p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HealthCare System. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

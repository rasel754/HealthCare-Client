import Link from "next/link";
import Navbar from "@/src/components/shared/Navbar";
import Footer from "@/src/components/shared/Footer";
import { Button } from "@/src/components/ui/button";
import { Activity, Calendar, ShieldCheck, Stethoscope, Clock, Award, ArrowRight, HeartPulse, Video } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Stethoscope,
      title: "Verified Specialist Doctors",
      description: "Connect with certified medical specialists across Cardiology, Neurology, Pediatrics, and more.",
    },
    {
      icon: Calendar,
      title: "Instant Schedule Booking",
      description: "Book video consultations or hospital visits with real-time schedule slot availability.",
    },
    {
      icon: Video,
      title: "HD Video Consultation",
      description: "Secure, high-definition video call link generated directly for every scheduled appointment.",
    },
    {
      icon: ShieldCheck,
      title: "Encrypted Health Records",
      description: "Your diagnostic medical reports and issued digital prescriptions are safely stored and accessible anytime.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                <HeartPulse className="h-4 w-4" /> Next-Gen Health Care System
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
                Your Health, Our Priority. <br className="hidden sm:inline" />
                <span className="text-primary">Instant Doctor Consultation.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Find top-rated specialist doctors, schedule real-time appointment slots, pay securely via Stripe, and receive instant digital prescriptions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/consultation">
                  <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 h-12 text-base gap-2 shadow-lg shadow-primary/20">
                    Find a Doctor Now <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-8 h-12 text-base shadow-xs">
                    Patient Registration
                  </Button>
                </Link>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-border max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">500+</p>
                  <p className="text-xs text-muted-foreground font-medium">Expert Doctors</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">50k+</p>
                  <p className="text-xs text-muted-foreground font-medium">Happy Patients</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">99.8%</p>
                  <p className="text-xs text-muted-foreground font-medium">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Hero Graphic Card */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-2xl border border-border space-y-6">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl shadow-sm">
                    <Stethoscope className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Dr. Sarah Jenkins</h3>
                    <p className="text-xs text-primary font-semibold">Chief Cardiologist • MD, FACC</p>
                    <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs font-bold">
                      ★ 4.9 (128 reviews)
                    </div>
                  </div>
                </div>

                <div className="bg-muted/40 border border-border p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>Available Slot Today</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs">Active</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>04:00 PM - 04:30 PM</span>
                    </div>
                    <span className="text-primary font-extrabold">$50.00</span>
                  </div>
                </div>

                <Link href="/consultation" className="block">
                  <Button className="w-full rounded-xl h-11 text-sm font-semibold gap-2 shadow-sm">
                    Book Instant Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 bg-muted/20 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
              Complete Digital Healthcare Platform
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              Everything you need for seamless patient-doctor consultations and health management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-card text-card-foreground p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

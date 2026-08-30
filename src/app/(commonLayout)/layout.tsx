import Navbar from "@/src/components/shared/Navbar";
import Footer from "@/src/components/shared/Footer";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
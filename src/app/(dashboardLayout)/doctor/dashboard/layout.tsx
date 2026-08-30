import DashboardContainer from "@/src/components/shared/DashboardContainer";

export default function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardContainer>{children}</DashboardContainer>;
}
import DashboardContainer from "@/src/components/shared/DashboardContainer";

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardContainer>{children}</DashboardContainer>;
}
import DashboardContainer from "@/src/components/shared/DashboardContainer";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardContainer>{children}</DashboardContainer>;
}
import DashboardContainer from "@/src/components/shared/DashboardContainer";

export default function CommonProtectedLayout({ children }: { children: React.ReactNode }) {
  return <DashboardContainer>{children}</DashboardContainer>;
}
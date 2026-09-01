import DashboardContainer from "@/src/components/shared/DashboardContainer";

export const dynamic = "force-dynamic";

export default function PatientRouteLayout({ children }: { children: React.ReactNode }) {
  return <DashboardContainer>{children}</DashboardContainer>;
}

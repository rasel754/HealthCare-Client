import DashboardContainer from "@/src/components/shared/DashboardContainer";

export const dynamic = "force-dynamic";

export default function CommonProtectedLayout({ children }: { children: React.ReactNode }) {
  return <DashboardContainer>{children}</DashboardContainer>;
}
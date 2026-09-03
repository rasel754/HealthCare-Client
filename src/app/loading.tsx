import { MedicalLoader } from "@/src/components/shared/MedicalLoader";

export default function GlobalLoading() {
  return (
    <MedicalLoader
      variant="fullscreen"
      title="HealthCare Medical Portal"
      subtitle="Initializing clinical environment and secure workspace"
      icon="heart"
      showECG={true}
    />
  );
}
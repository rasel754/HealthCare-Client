import { MedicalLoader } from "@/src/components/shared/MedicalLoader";

export default function ConsultationLoading() {
  return (
    <MedicalLoader
      variant="fullscreen"
      title="Accessing Medical Specialists"
      subtitle="Connecting you with certified clinical doctors and specialist availability"
      icon="stethoscope"
      showECG={true}
    />
  );
}
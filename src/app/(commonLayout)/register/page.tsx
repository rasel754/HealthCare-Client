import RegisterForm from "@/src/components/modules/auth/RegisterForm";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
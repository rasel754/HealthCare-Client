import ForgetPasswordForm from "@/src/components/modules/auth/ForgetPasswordForm";

export const dynamic = "force-dynamic";

export default function ForgetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <ForgetPasswordForm />
    </div>
  );
}
import LoginForm from "@/src/components/modules/auth/LoginForm";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface LoginParams {
  searchParams?: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = searchParams ? await searchParams : {};
  const redirectPath = params?.redirect;
  return (
    <Suspense fallback={<div className="w-full max-w-md mx-auto min-h-[400px] animate-pulse bg-card rounded-2xl border border-border" />}>
      <LoginForm redirectPath={redirectPath}/>
    </Suspense>
  );
}

export default LoginPage;
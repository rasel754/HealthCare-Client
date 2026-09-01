import LoginForm from "@/src/components/modules/auth/LoginForm";

export const dynamic = "force-dynamic";

interface LoginParams {
  searchParams?: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = searchParams ? await searchParams : {};
  const redirectPath = params?.redirect;
  return (
    <LoginForm redirectPath={redirectPath}/>
  );
}

export default LoginPage;
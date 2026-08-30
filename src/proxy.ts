import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "@/src/types/auth.type";

interface DecodedToken {
  id?: string;
  email?: string;
  role?: string;
  exp?: number;
}

function decodeJwtToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    
    // Check expiration if exp field exists
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function getRoleDashboard(role?: string): string {
  if (role === Role.SUPER_ADMIN || role === Role.ADMIN) {
    return "/admin/dashboard";
  }
  if (role === Role.DOCTOR) {
    return "/doctor/dashboard";
  }
  return "/dashboard";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const decodedToken = accessToken ? decodeJwtToken(accessToken) : null;
  const userRole = decodedToken?.role;
  const isAuthenticated = !!decodedToken;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");
  const isDoctorRoute = pathname.startsWith("/doctor");
  const isPatientRoute = pathname.startsWith("/dashboard");
  const isCommonProtectedRoute = pathname.startsWith("/my-profile") || pathname.startsWith("/change-password");

  // 1. Authenticated users attempting to visit login/register should be redirected to their dashboard
  if (isAuthRoute) {
    if (isAuthenticated && userRole) {
      const destination = getRoleDashboard(userRole);
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // 2. Unauthenticated users attempting to visit protected routes -> redirect to login
  if (!isAuthenticated && (isAdminRoute || isDoctorRoute || isPatientRoute || isCommonProtectedRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Role-Based Access Control for Admin Routes
  if (isAdminRoute) {
    if (userRole !== Role.SUPER_ADMIN && userRole !== Role.ADMIN) {
      const destination = getRoleDashboard(userRole);
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // Super Admin restricted sub-route
    if (pathname.startsWith("/admin/dashboard/admins-management") && userRole !== Role.SUPER_ADMIN) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // 4. Role-Based Access Control for Doctor Routes
  if (isDoctorRoute) {
    if (userRole !== Role.DOCTOR) {
      const destination = getRoleDashboard(userRole);
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // 5. Role-Based Access Control for Patient Routes (/dashboard)
  if (isPatientRoute) {
    if (userRole === Role.SUPER_ADMIN || userRole === Role.ADMIN) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (userRole === Role.DOCTOR) {
      return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

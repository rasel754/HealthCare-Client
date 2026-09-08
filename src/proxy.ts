import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, isValidRedirectForRole, UserRole } from "./lib/authUtils";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function refreshTokenMiddleware(refreshToken: string, sessionToken?: string): Promise<boolean> {
  try {
    if (!BASE_API_URL || !refreshToken) return false;
    const cookieParts = [`refreshToken=${refreshToken}`];
    if (sessionToken) {
      cookieParts.push(`better-auth.session_token=${sessionToken}`);
      cookieParts.push(`better-auth-session=${sessionToken}`);
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Cookie: cookieParts.join("; "),
    };
    if (sessionToken) {
      headers["Authorization"] = `Bearer ${sessionToken}`;
      headers["x-session-token"] = sessionToken;
    }
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        refreshToken,
        sessionToken,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
   try {
       if (
         process.env.NEXT_PHASE === "phase-production-build" ||
         process.env.NEXT_PHASE === "phase-export"
       ) {
           return NextResponse.next();
       }

       if (!request) return NextResponse.next();

       let pathname = "";
       try {
           pathname = request.nextUrl?.pathname || "";
       } catch {
           return NextResponse.next();
       }

       if (!pathname || pathname.startsWith("/_") || pathname.includes("error") || pathname.includes("not-found")) {
           return NextResponse.next();
       }

       const jwtUtils = (await import("./lib/jwtUtils")).default;
       const { isTokenExpiringSoon } = await import("./lib/tokenUtils");

       let accessToken: string | undefined;
       let refreshToken: string | undefined;
       let sessionToken: string | undefined;

       try {
           accessToken = request.cookies.get("accessToken")?.value;
           refreshToken = request.cookies.get("refreshToken")?.value;
           sessionToken =
               request.cookies.get("better-auth.session_token")?.value ||
               request.cookies.get("better-auth-session")?.value ||
               request.cookies.get("better-auth-session-token")?.value;
       } catch {
           return NextResponse.next();
       }

       const decodedAccessToken =  accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;

       const isValidAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

       let userRole: UserRole | null = null;

       if(decodedAccessToken){
            userRole = decodedAccessToken.role as UserRole;
       }

       const routerOwner = getRouteOwner(pathname);

       const isAuth = isAuthRoute(pathname);


       //proactively refresh token if refresh token exists and access token is expired or about to expire
       if (isValidAccessToken && accessToken && refreshToken && (await isTokenExpiringSoon(accessToken))){
            const requestHeaders = new Headers(request.headers);

            const response = NextResponse.next({
                request: {
                    headers : requestHeaders
            
                },
            })


            try {
                const refreshed = await refreshTokenMiddleware(refreshToken, sessionToken);

                if(refreshed){
                    requestHeaders.set("x-token-refreshed", "1");
                }

                return NextResponse.next(
                    {
                        request: {
                            headers : requestHeaders
                        },
                        headers : response.headers
                    }
                )
            } catch (error) {
                console.error("Error refreshing token:", error);

            }

            return response;
       }

       // Rule - 1 : User is logged in (has access token) and trying to access auth route -> redirect to dashboard
       if(isAuth && isValidAccessToken){
            if (pathname === "/reset-password") {
                const email = request.nextUrl.searchParams.get("email");
                if (email) {
                    return NextResponse.next();
                }
            } else if (pathname === "/verify-email") {
                const email = request.nextUrl.searchParams.get("email");
                if (email) {
                    return NextResponse.next();
                }
            }
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
       }

       // Rewrite /forgot-password to /forget-password
       if(pathname === "/forgot-password"){
            const url = request.nextUrl.clone();
            url.pathname = "/forget-password";
            return NextResponse.rewrite(url);
       }

       // Rule-2 User trying to access Public route -> allow
       if(routerOwner === null){
            return NextResponse.next();
       }

       // Rule - 3 User is Not logged in but trying to access protected route -> try refreshing token if refreshToken exists, else redirect to login
       if(!accessToken || !isValidAccessToken){
            if (refreshToken) {
                try {
                    const refreshed = await refreshTokenMiddleware(refreshToken, sessionToken);
                    if (refreshed) {
                        return NextResponse.next();
                    }
                } catch (error) {
                    console.error("Error refreshing token in proxy:", error);
                }
            }

            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
       }

       // Rule - 4 User trying to access Common protected route (e.g. /my-profile, /change-password) -> allow
       if(routerOwner === "COMMON"){
            return NextResponse.next();
       }

       // Rule - 5 Role-based access control
       if (!isValidRedirectForRole(pathname, userRole as UserRole)) {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
       }

       return NextResponse.next();

   } catch (error) {
         console.error("Error in proxy middleware:", error);
         return NextResponse.next();
   }
}

export const config = {
    matcher : [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next|_global-error|_not-found|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ]
}
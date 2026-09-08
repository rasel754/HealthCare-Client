export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export const authRoutes = [ "/login", "/register", "/forgot-password", "/forget-password", "/reset-password", "/verify-email" ];

export const isAuthRoute = (pathname : string) => {

    return authRoutes.some((router : string) => router === pathname);
}

export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
}

export const commonProtectedRoutes : RouteConfig = {
    exact : ["/my-profile", "/change-password"],
    pattern : [/^\/my-profile(\/.*)?$/, /^\/change-password(\/.*)?$/]
}

export const doctorProtectedRoutes : RouteConfig = {
    pattern: [/^\/doctor\/dashboard(\/.*)?$/],
    exact : ["/doctor/dashboard"]
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin\/dashboard(\/.*)?$/],
    exact : ["/admin/dashboard"]
}

export const superAdminProtectedRoutes : RouteConfig = {
    exact : ["/admin/dashboard/admins-management"],
    pattern : [/^\/admin\/dashboard\/admins-management(\/.*)?$/]
}

export const patientProtectedRoutes : RouteConfig = {
    pattern: [/^\/dashboard(\/.*)?$/],
    exact : ["/dashboard", "/payment/success"]
};

export const isRouteMatches = (pathname : string, routes : RouteConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern : RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) : "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    if(isRouteMatches(pathname, superAdminProtectedRoutes)) {
        return "SUPER_ADMIN";
    }

    if(isRouteMatches(pathname, doctorProtectedRoutes)) {
        return "DOCTOR";
    }

    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    
    if(isRouteMatches(pathname, patientProtectedRoutes)) {
        return "PATIENT";
    }

    return null; // public route
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    if(role === "ADMIN" || role === "SUPER_ADMIN") {
        return "/admin/dashboard";
    }
    if(role === "DOCTOR") {
        return "/doctor/dashboard";
    }
    if(role === "PATIENT") {
        return "/dashboard";
    }

    return "/";
}

export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
    const routeOwner = getRouteOwner(redirectPath);

    if(routeOwner === null || routeOwner === "COMMON"){
        return true;
    }

    if(routeOwner === "SUPER_ADMIN" && role === "SUPER_ADMIN"){
        return true;
    }

    if(routeOwner === "ADMIN" && (role === "ADMIN" || role === "SUPER_ADMIN")){
        return true;
    }

    if(routeOwner === role){
        return true;
    }

    return false;
}
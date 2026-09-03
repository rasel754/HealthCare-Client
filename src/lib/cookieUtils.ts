"use server";

import { cookies } from "next/headers";

export const setCookie = async (
    name : string,
    value : string,
    maxAgeInSeconds : number,
) => {
    try {
        const cookieStore = await cookies();
        cookieStore.set(name, value, {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "lax",
            path : "/",
            maxAge : maxAgeInSeconds,
        });

    } catch {
        // ignore when cookies unavailable
    }
}

export const getCookie = async (name : string) => {
    try {
        const cookieStore = await cookies();
        return cookieStore.get(name)?.value;
    } catch {
        return undefined;
    }
}

export const deleteCookie = async (name : string) => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(name);
    } catch {
        // ignore when cookies unavailable
    }
}
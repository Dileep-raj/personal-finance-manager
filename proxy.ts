import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUsername } from "@/lib/actions/session";

const publicRoutes = new Set(["/login", "/signup"]);
const protectedRoutes = new Set(["/", "/dashboard"]);

const proxy = async (req: NextRequest) => {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.has(path);
    const isPublicRoute = publicRoutes.has(path);

    const username = await getSessionUsername(await cookies());

    if (isProtectedRoute && !username) return NextResponse.redirect(new URL("/login", req.nextUrl))

    if (isPublicRoute && username) return NextResponse.redirect(new URL("/", req.nextUrl))

    return NextResponse.next();
}

export default proxy;

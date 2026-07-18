import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decryptJWT } from "@/lib/actions/session";

const publicRoutes = new Set(["/login"]);
const protectedRoutes = new Set(["/"]);

const proxy = async (req: NextRequest) => {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.has(path);
    const isPublicRoute = publicRoutes.has(path);

    const cookieStore = await cookies()
    const cookie = cookieStore.get("session")?.value;
    const username = (await decryptJWT(cookie))?.username;

    if (isProtectedRoute && !username) return NextResponse.redirect(new URL("/login", req.nextUrl))

    if (isPublicRoute && username) return NextResponse.redirect(new URL("/", req.nextUrl))

    return NextResponse.next();
}

export default proxy;

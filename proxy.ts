import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decryptJWT } from "@/lib/actions/session";

const publicRoutes = ["/login"];
const protectedRoutes = ["/"];

const proxy = async (req: NextRequest) => {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookieStore = await cookies()
    const cookie = cookieStore.get("session")?.value;
    const session = await decryptJWT(cookie);

    if (isProtectedRoute && !session?.username) return NextResponse.redirect(new URL("/login", req.nextUrl));

    if (isPublicRoute && session?.username) return NextResponse.redirect(new URL("/", req.nextUrl));

    return NextResponse.next();
}

export default proxy;

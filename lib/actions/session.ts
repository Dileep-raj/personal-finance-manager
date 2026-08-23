import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);
const SESSION_TIMEOUT = Number.parseInt(process.env.SESSION_TIMEOUT ?? "1200000")

export const createSession = async (username: string) => {
    const expiresAt = new Date(Date.now() + SESSION_TIMEOUT);
    const session = await encryptJWT({ username, expiresAt });
    const cookieStore = await cookies()
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
    });
}

export const deleteSession = async () => {
    const cookieStore = await cookies()
    cookieStore.delete("session")
}

type SessionCookiePayload = {
    username: string;
    expiresAt: Date;
};

export const encryptJWT = async (payload: SessionCookiePayload) => {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt)
        .sign(encodedKey);
}

export const decryptJWT = async (session: string) => {
    if (!session) {
        // console.log("Session key not found")
        return
    }
    try {
        const { payload } = await jwtVerify<SessionCookiePayload>(session, encodedKey, { algorithms: ["HS256"] });
        return payload;
    } catch (err) {
        console.error("Failed to verify session\n", err)
    }
}

/**
 * Get username from the given session cookie
 * @returns Username | `undefined`
 */
// export const getSessionUsername = async (cookieStore: CookieStore) => {
export const getSessionUsername = async (cookieStore: ReadonlyRequestCookies) => {
    // const cookieStore = await cookies()
    const cookie = cookieStore.get("session");
    if (!cookie) return
    const username = (await decryptJWT(cookie.value))?.username;
    return username
}

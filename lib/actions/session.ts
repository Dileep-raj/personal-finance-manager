import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const createSession = async (username: string) => {
    const expiresAt = new Date(Date.now() + parseInt(process.env.SESSION_TIMEOUT ?? "1200000"));
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
    return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(encodedKey);
}

export const decryptJWT = async (session: string | undefined = "") => {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (err) {
        console.log("Failed to verify session");
    }
}
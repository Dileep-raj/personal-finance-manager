'use server';

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/actions/session";
import { redirect } from "next/navigation";
import { passwordRegex, usernameRegex } from "../common/constants";

const testUser = {
    username: "rahuldas",
    password: "Rd@920485",
};

const loginSchema = z.object({
    username: z.string().regex(usernameRegex, { error: "Invalid username" }).trim(),
    password: z.string().regex(passwordRegex, { error: "Invalid password" }).trim(),
});

export const login = async (prevState: any, formData: FormData) => {

    const result = loginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success)
        return { errors: { message: "Invalid username or password" } }

    const { username, password } = result.data

    if (username !== testUser.username || password !== testUser.password)
        return { errors: { message: ["Invalid username or password"] } }

    await createSession(testUser.username);

    redirect("/");
}

export const logout = async () => {
    await deleteSession();
    redirect("/login");
}

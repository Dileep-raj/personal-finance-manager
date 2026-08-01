'use server';

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/actions/session";
import { redirect } from "next/navigation";
import { passwordRegex, usernameRegex } from "../common/constants";
import User from "../models/user.model";

const defaultUser = {
    username: process.env.DEFAULT_USER_USERNAME,
    password: process.env.DEFAULT_USER_PASSWORD,
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

    const user = await User.findOne({ username })

    // if (!user?.validPassword(password) || username !== defaultUser.username || password !== defaultUser.password)
    if (!user?.validPassword(password))
        return { errors: { message: "Invalid username or password" } }

    await createSession(username);

    redirect("/");
}

export const logout = async () => {
    await deleteSession();
    redirect("/login");
}

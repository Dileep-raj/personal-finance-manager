'use server';

import { z } from "zod";
import { redirect } from "next/navigation";
import { allowedSpecialCharacters, passwordRegex, usernameRegex } from "../common/constants";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose";
import { NextResponse } from "next/server";

const signupSchema = z.object({
    username: z.string()
        .toLowerCase()
        .max(30, "Username must not exceed 30 characters")
        .min(5, "Username must be atleast 5 characters long")
        .regex(usernameRegex, { error: "Invalid username" })
        .trim(),
    password: z.string()
        .min(8, { error: "Password must be atleast 8 characters long" })
        .regex(/[A-Z]+/, { error: "Password must contain an uppercase character" })
        .regex(/[a-z]+/, { error: "Password must contain a lowercase character" })
        .regex(/\d+/, { "error": "Password must contain a digit" })
        .regex(new RegExp(`[${allowedSpecialCharacters}]+`), { error: "Password must contain a special character" })
        .regex(passwordRegex, { error: "Invalid password" })
        .trim(),
});

export type SignupFormState = {
    success: boolean;
    message: string;
};

export const signup = async (prevState: SignupFormState, formData: FormData) => {

    const connected = await connectToDatabase()
    if (!connected) console.error("Could not connect to mongodb!")
    // Validate username and password with zod schema
    const result = signupSchema.safeParse(Object.fromEntries(formData))
    if (result.error) return z.treeifyError(result.error)

    const { username, password } = result.data

    try {
        // Check if username already exists
        const user = await User.findOne({ username })
        if (user) return { errors: { message: "Username already exists" } }

        const newUser = new User({ username, password })
        const save = await newUser.save()
        if (save.username) console.log("Saved user", save.username)
        else return NextResponse.json({ errors: { message: "Signup failed" } })
    }
    catch (error) {
        return NextResponse.json(error?.errors || { errors: { message: "Signup failed" } })
    }

    redirect("/login");
}

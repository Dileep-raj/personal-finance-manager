'use server';

import { z } from "zod";
import { redirect } from "next/navigation";
import { allowedSpecialCharacters, passwordRegex, usernameRegex } from "../common/constants";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose";

const signupSchema = z.object({
  username: z.string()
    .toLowerCase()
    .max(20, "Username must not exceed 20 characters")
    .min(5, "Username must be atleast 5 characters long")
    .regex(usernameRegex, { error: "Invalid username" })
    .trim(),
  password: z.string()
    .min(8, { error: "Password must be atleast 8 characters long" })
    .regex(/[A-Z]+/, { error: "Password must contain an uppercase letter" })
    .regex(/[a-z]+/, { error: "Password must contain a lowercase letter" })
    .regex(/\d+/, { "error": "Password must contain a digit" })
    .regex(new RegExp(`[${allowedSpecialCharacters}]+`), { error: "Password must contain a special character" })
    .regex(passwordRegex, { error: "Invalid password" })
    .trim(),
});

export type SignupFormState = {
  status?: number
  success: boolean
  message?: string
  errors?: string[]
  properties?: {
    username?: {
      errors: string[]
    }
    password?: {
      errors: string[];
    }
  }
};

export const signup = async (prevState: SignupFormState, formData: FormData): Promise<SignupFormState> => {

  const connected = await connectToDatabase()
  if (!connected) console.error("Could not connect to mongodb!")

  // Validate username and password with zod schema
  const result = signupSchema.safeParse(Object.fromEntries(formData))
  if (result.error) return { ...z.treeifyError(result.error), success: false, status: 400 }

  const { username, password } = result.data

  try {
    // Check if username already exists
    const user = await User.findOne({ username })
    if (user) return { message: "Username already exists", success: false, status: 400 }

    const newUser = new User({ username, password })
    const save = await newUser.save()
    if (save.username) console.log("Saved user", save.username)
    else return { message: "Signup failed", success: false, status: 400 }
  }
  catch (error) {
    console.error(error)
    return { message: "Signup failed", success: false, status: 500 }
  }

  redirect("/login");
}

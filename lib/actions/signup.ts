'use server';

import { z } from "zod";
import User from "@/lib/mongodb/models/user.model";
import { CommonResponse } from "@/lib/types";
import { SignupPayload, signupSchema } from "../schemas/signup";

export interface SignupFormState extends Partial<ReturnType<typeof z.flattenError<SignupPayload>>>, CommonResponse {
  status?: number
}

export const signup = async (prevState: SignupFormState, formData: FormData): Promise<SignupFormState> => {

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

    return { success: true, status: 201, message: "Signup successful!" }
  }
  catch (error) {
    console.error(error)
    return { message: "Signup failed", success: false, status: 500 }
  }
}

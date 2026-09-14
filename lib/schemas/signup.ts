import { z } from "zod";
import { allowedSpecialCharacters, passwordRegex, usernameRegex } from "@/lib/common/constants";

const transformToTitleCase = (s: string) => {
    return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export const signupSchema = z.object({
    username: z.string({ error: "Username must be a string" })
        .toLowerCase()
        .max(20, "Username must not exceed 20 characters")
        .min(5, "Username must be atleast 5 characters long")
        .regex(usernameRegex, { error: "Use only lowercase letters (a-z), underscore (_) or dot (.)" })
        .trim()
        .nonempty({ error: "Username is required" }),
    password: z.string({ error: "Password must be a string" })
        .min(8, { error: "Password must be atleast 8 characters" })
        .max(100, { error: "Password must not exceed 100 characters" })
        .regex(/[A-Z]+/, { error: "Password must contain an uppercase letter" })
        .regex(/[a-z]+/, { error: "Password must contain a lowercase letter" })
        .regex(/\d+/, { "error": "Password must contain a digit" })
        .regex(
            new RegExp(`[${allowedSpecialCharacters}]+`),
            { error: "Password must contain a special character\n(! @ # $ % ^ & * ? + -)" }
        )
        .regex(
            new RegExp((String.raw`^[A-Za-z\d${allowedSpecialCharacters}]+$`)),
            { error: "Password must contain only the following special characters:\n(! @ # $ % ^ & * ? + -)" }
        )
        .regex(passwordRegex, { error: "Invalid password" })
        .trim(),
    firstname: z.string({ error: "First name must be a string" })
        .max(50, { error: "First name cannot exceed 50 characters" })
        .trim()
        .nonempty({ error: "First name cannot be empty" })
        .transform(transformToTitleCase),
    lastname: z.string({ error: "Last name must be a string" })
        .max(50, { error: "Last name cannot exceed 50 characters" })
        .trim()
        .nonempty({ error: "Last name cannot be empty" })
        .transform(transformToTitleCase)
});

export type SignupPayload = z.infer<typeof signupSchema>

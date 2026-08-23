"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { signup, SignupFormState } from "@/lib/actions/signup";
import PasswordShowToggleIcon from "@/components/buttons/PasswordShowToggleIcon";
import Link from "next/link";
import { CheckIcon, XIcon } from "lucide-react";
import { allowedSpecialCharacters, usernameRegex } from "@/lib/common/constants";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

const uppercaseRegex = new RegExp(/[A-Z]+/)
const lowercaseRegex = new RegExp(/[a-z]+/)
const digitRegex = new RegExp(/\d+/)
const specialCharacterRegex = new RegExp(`[${allowedSpecialCharacters}]+`)
const illegalCharactersRegex = new RegExp((String.raw`[^A-Za-z\d${allowedSpecialCharacters}]+`))
const initialFormDataCheck = {
    username: {
        error: "",
    },
    password: {
        uppercase: false,
        lowercase: false,
        digit: false,
        length: false,
        specialCharacter: false,
        ok: false
    },
    passwordsMatch: true,
    ok: false
}

const SignupForm = () => {

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null)

    const initialState: SignupFormState = {
        success: false
    }

    const [state, signupAction, pending] = useActionState(signup, initialState)
    const [hidden, setHidden] = useState(true)
    const [formDataChecks, setFormDataChecks] = useState(initialFormDataCheck)
    
    useEffect(() => {
        if (state.success) {
            toast.success("Account created successfully")
            redirect("/login")
        }
    }, [state])

    const performFormDataChecks = () => {
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value
        const checks = structuredClone(initialFormDataCheck)
        if (username) {
            if (username.length < 5 || username.length > 20) checks.username.error = "Username must be 5-20 characters long"
            else if (!usernameRegex.test(username)) checks.username.error = "Use only lowercase letters, numbers, dots (.) and underscores (_)"
            else checks.username.error = ""
        }
        if (password) {
            checks.password.uppercase = uppercaseRegex.test(password)
            checks.password.lowercase = lowercaseRegex.test(password)
            checks.password.digit = digitRegex.test(password)
            checks.password.specialCharacter = specialCharacterRegex.test(password) && !illegalCharactersRegex.test(password)
            checks.password.length = password.length >= 8 && password.length <= 100
            checks.password.ok = checks.password.uppercase && checks.password.lowercase && checks.password.digit &&
                checks.password.specialCharacter && checks.password.length
        }
        checks.passwordsMatch = checkPasswordMatch()
        checks.ok = checks.username.error === "" && checks.password.ok && confirmPasswordRef.current?.value !== ""
        setFormDataChecks(checks)
    }

    const checkPasswordMatch = () => {
        if (!passwordRef.current?.value || !confirmPasswordRef.current?.value) return true
        return passwordRef.current?.value === confirmPasswordRef.current?.value
    }

    return (
        <form action={signupAction} className="mt-10 gap-4 sm:mx-auto sm:w-full sm:max-w-md flex flex-col justify-center p-10 rounded-2xl border">
            <div className="text-center mb-4">
                <h4 className="text-xl font-medium text-gray-800">Create a new account</h4>
            </div>

            <div>
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900"> Username </label>
                <div className="mt-2">
                    <input id="username" name="username" type="username" minLength={5} onChange={performFormDataChecks} ref={usernameRef} required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
                {
                    formDataChecks.username.error && <span className="error-message mt-1 text-sm text-red-600 text-center font-medium">
                        {formDataChecks.username.error}
                    </span>
                }
            </div>

            <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900"> Password </label>
                <div className="mt-2 relative flex">
                    <input id="password" name="password" type={hidden ? "password" : "text"} minLength={8} onChange={performFormDataChecks} ref={passwordRef} required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900"> Confirm Password </label>
                <div className="mt-2 relative flex">
                    <input id="confirmPassword" type={hidden ? "password" : "text"} onChange={performFormDataChecks} ref={confirmPasswordRef} required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                </div>
                {
                    !formDataChecks.passwordsMatch &&
                    <span className="error-message mt-1 text-sm text-red-600 text-center font-medium">Passwords do not match</span>
                }
            </div>

            {
                !formDataChecks.password.ok &&
                <div className="password-validations text-sm flex flex-col gap-1.5">
                    <div className={`flex items-center gap-1 ${formDataChecks.password.uppercase ? "text-green-500" : "text-red-500"}`}>
                        {formDataChecks.password.uppercase ? <CheckIcon /> : <XIcon />}
                        <span> Password must contain an uppercase letter </span>
                    </div>
                    <div className={`flex items-center gap-1 ${formDataChecks.password.lowercase ? "text-green-500" : "text-red-500"}`}>
                        {formDataChecks.password.lowercase ? <CheckIcon /> : <XIcon />}
                        <span> Password must contain a lowercase letter </span>
                    </div>
                    <div className={`flex items-center gap-1 ${formDataChecks.password.digit ? "text-green-500" : "text-red-500"}`}>
                        {formDataChecks.password.digit ? <CheckIcon /> : <XIcon />}
                        <span> Password must contain a number </span>
                    </div>
                    <div className={`flex items-center gap-1 ${formDataChecks.password.specialCharacter ? "text-green-500" : "text-red-500"}`}>
                        {formDataChecks.password.specialCharacter ? <CheckIcon /> : <XIcon />}
                        <div>
                            Password must contain a special character
                            <div> (! @ # $ % ^ & * ? + -) </div>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 ${formDataChecks.password.length ? "text-green-500" : "text-red-500"}`}>
                        {formDataChecks.password.length ? <CheckIcon /> : <XIcon />}
                        <span> Password must contain atleast 8 characters </span>
                    </div>
                </div>
            }

            <div className="flex h-4 items-center justify-center">
                {
                    !state?.success &&
                    <span className="error-message mt-1 text-sm text-red-600 text-center font-medium">
                        {state.errors?.[0] || state.properties?.username?.errors?.[0] || state.properties?.password?.errors?.[0] || state.message || ""}
                    </span>
                }
            </div>

            <button disabled={!(formDataChecks.ok && formDataChecks.passwordsMatch && !pending)} type="submit"
                className="flex w-full items-center justify-center px-3 py-1.5 text-sm/6 font-semibold shadow-xs bg-blue-500 hover:bg-blue-400 mx-auto rounded-md text-white cursor-pointer m-3 disabled:pointer-events-none disabled:opacity-50">
                <span> Sign up </span>
            </button>

            <div className="self-center font-medium text-sm">
                <span> Already have an account? </span>
                <Link href="/login" className="text-blue-500">Login</Link>
            </div>

        </form >
    )
}

export default SignupForm

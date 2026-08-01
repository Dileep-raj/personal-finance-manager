"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useRef, useState } from "react";
import { signup } from "@/lib/actions/signup";
import PasswordShowToggleIcon from "@/components/buttons/PasswordShowToggleIcon";
import Link from "next/link";
import { CheckIcon, XIcon } from "lucide-react";
import { allowedSpecialCharacters } from "@/lib/common/constants";

const uppercaseRegex = new RegExp(/[A-Z]+/)
const lowercaseRegex = new RegExp(/[a-z]+/)
const digitRegex = new RegExp(/\d+/)
const specialCharacterRegex = new RegExp(`[${allowedSpecialCharacters}]+`)

const SignupButton = ({ disabled = false }: { disabled?: boolean }) => {
    const { pending } = useFormStatus();
    return <button disabled={disabled || pending} type="submit"
        className="flex w-full items-center justify-center px-3 py-1.5 text-sm/6 font-semibold shadow-xs bg-blue-500 hover:bg-blue-400 mx-auto rounded-md text-white cursor-pointer m-3 disabled:pointer-events-none disabled:opacity-50">
        <span> Sign up </span>
    </button>
}

const SignupForm = () => {

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null)

    const [state, signupAction] = useActionState(signup, undefined)

    const [hidden, setHidden] = useState(true)

    const [passwordChecks, setPasswordChecks] = useState({
        uppercase: false,
        lowercase: false,
        digit: false,
        minCharacters: false,
        specialCharacter: false,
    })

    const [passwordsMatch, setPasswordsMatch] = useState(true)

    const signupEnabled = Object.values(passwordChecks).every(Boolean) && passwordsMatch

    const performPasswordChecks = () => {
        const password = passwordRef.current?.value
        if (password) {
            setPasswordChecks({
                uppercase: uppercaseRegex.test(password),
                lowercase: lowercaseRegex.test(password),
                digit: digitRegex.test(password),
                specialCharacter: specialCharacterRegex.test(password),
                minCharacters: password.length >= 8,
            })
            checkPasswordMatch()
        }
    }

    const checkPasswordMatch = () => {
        if (!passwordRef.current?.value || !confirmPasswordRef.current?.value) setPasswordsMatch(true)
        setPasswordsMatch(passwordRef.current?.value === confirmPasswordRef.current?.value)
    }

    return (
        <form action={signupAction} className="mt-10 gap-4 sm:mx-auto sm:w-full sm:max-w-md flex flex-col justify-center p-10 rounded-2xl border">
            <div className="text-center mb-4">
                <h4 className="text-xl font-medium text-gray-800">Create a new account</h4>
            </div>

            <div>
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900"> Username </label>
                <div className="mt-2">
                    <input id="username" name="username" type="username" ref={usernameRef} required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900"> Password </label>
                <div className="mt-2 relative flex">
                    <input id="password" name="password" type={hidden ? "password" : "text"} onChange={performPasswordChecks} ref={passwordRef} required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900"> Confirm Password </label>
                <div className="mt-2 relative flex">
                    <input id="confirmPassword" type={hidden ? "password" : "text"} onInput={checkPasswordMatch} ref={confirmPasswordRef} required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                </div>
                {
                    !passwordsMatch && <span className="error-message mt-1 text-sm text-red-600 text-center font-medium">Passwords do not match</span>
                }
            </div>

            <div className="password-validations text-sm flex flex-col gap-1.5">
                <div className={`flex items-center gap-1 ${passwordChecks.uppercase ? "text-green-500" : "text-red-500"}`}>
                    {passwordChecks.uppercase ? <CheckIcon /> : <XIcon />}
                    <span> Password must contain an uppercase character </span>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.lowercase ? "text-green-500" : "text-red-500"}`}>
                    {passwordChecks.lowercase ? <CheckIcon /> : <XIcon />}
                    <span> Password must contain a lowercase character </span>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.digit ? "text-green-500" : "text-red-500"}`}>
                    {passwordChecks.digit ? <CheckIcon /> : <XIcon />}
                    <span> Password must contain a digit </span>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.specialCharacter ? "text-green-500" : "text-red-500"}`}>
                    {passwordChecks.specialCharacter ? <CheckIcon /> : <XIcon />}
                    <div>
                        Password must contain a special character
                        <div> (!, @, #, $, %, ^, &, *, ?, + or -) </div>
                    </div>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.minCharacters ? "text-green-500" : "text-red-500"}`}>
                    {passwordChecks.minCharacters ? <CheckIcon /> : <XIcon />}
                    <span> Password must contain atleast 8 characters </span>
                </div>
            </div>

            <div className="flex h-4 items-center justify-center">
                {state?.errors?.message && <span className="error-message mt-1 text-sm text-red-600 text-center font-medium">{state.errors.message}</span>}
            </div>

            <SignupButton disabled={!signupEnabled} />

            <div className="self-center font-medium text-sm">
                <span> Already have an account? </span>
                <Link href="/login" className="text-blue-500">Login</Link>
            </div>

        </form >
    )
}

export default SignupForm

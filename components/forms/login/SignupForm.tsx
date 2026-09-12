"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { signup, SignupFormState } from "@/lib/actions/signup";
import PasswordShowToggleIcon from "@/components/buttons/PasswordShowToggleIcon";
import Link from "next/link";
import { CheckIcon, UserRoundPlusIcon, XIcon } from "lucide-react";
import { allowedSpecialCharacters, usernameRegex } from "@/lib/common/constants";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const uppercaseRegex = new RegExp(/[A-Z]+/)
const lowercaseRegex = new RegExp(/[a-z]+/)
const digitRegex = new RegExp(/\d+/)
const specialCharacterRegex = new RegExp(`[${allowedSpecialCharacters}]+`)
const illegalCharactersRegex = new RegExp((String.raw`[^A-Za-z\d${allowedSpecialCharacters}]+`))
const initialFormDataCheck = {
    username: {
        error: "",
        ok: false,
    },
    password: {
        uppercase: false,
        lowercase: false,
        digit: false,
        length: false,
        specialCharacter: false,
        ok: false
    },
    confirmPassword: {
        passwordsMatch: true,
        ok: false,
    },
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
            toast.add({
                type: "success",
                description: "Account created successfully"
            })
            redirect("/login")
        } else if (state.message || state.errors?.[0]) {
            toast.add({
                type: "error",
                description: state.message || state.errors?.[0] || "Something went wrong"
            })
        }
    }, [state])

    const performFormDataChecks = () => {
        const username = usernameRef.current?.value
        const password = passwordRef.current?.value
        const confirmPassword = confirmPasswordRef.current?.value

        const checks = structuredClone(initialFormDataCheck)

        if (username) {
            if (username.length < 5 || username.length > 20) checks.username.error = "Username must be 5-20 characters long"
            else if (!usernameRegex.test(username)) checks.username.error = "Use only lowercase letters, numbers, dots (.) and underscores (_)"
            else {
                checks.username.error = ""
                checks.username.ok = true
            }
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

        checks.confirmPassword.passwordsMatch = checkPasswordMatch(password, confirmPassword)
        checks.confirmPassword.ok = checks.confirmPassword.passwordsMatch && confirmPasswordRef.current?.value !== ""

        checks.ok = checks.username.ok && checks.password.ok && checks.confirmPassword.ok
        setFormDataChecks(checks)
    }

    const checkPasswordMatch = (password?: string | null, confirmPassword?: string | null) => !password || !confirmPassword || password === confirmPassword

    return (
        <Card className="w-full max-w-sm p-6">
            <CardHeader className="text-center">
                <CardTitle>Create an account</CardTitle>
            </CardHeader>

            <CardContent>
                <form action={signupAction}>
                    <FieldGroup className="flex flex-col gap-6 mt-2">
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input id="username" name="username" type="text" minLength={5} onChange={performFormDataChecks}
                                ref={usernameRef} required aria-invalid={!formDataChecks.username.ok} />
                            <FieldError>{state.properties?.username?.errors?.[0] || formDataChecks.username.error}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput id="password" name="password" type={hidden ? "password" : "text"} onChange={performFormDataChecks}
                                    minLength={8} ref={passwordRef} required aria-invalid={!formDataChecks.password.ok} />
                                <InputGroupAddon>
                                    <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldError>{state.properties?.password?.errors?.[0]}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput id="confirmPassword" type={hidden ? "password" : "text"} onChange={performFormDataChecks}
                                    ref={confirmPasswordRef} required aria-invalid={!formDataChecks.confirmPassword.ok} />
                                <InputGroupAddon>
                                    <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                                </InputGroupAddon>
                            </InputGroup>
                            {!formDataChecks.confirmPassword.passwordsMatch && <FieldError>Passwords do not match</FieldError>}
                        </Field>

                        {
                            !formDataChecks.password.ok &&
                            <div className="password-validations text-sm flex flex-col gap-1.5">
                                <div className={`flex items-center gap-1 ${formDataChecks.password.uppercase ? "text-success" : "text-destructive"}`}>
                                    {formDataChecks.password.uppercase ? <CheckIcon /> : <XIcon />}
                                    <span> Password must contain an uppercase letter </span>
                                </div>
                                <div className={`flex items-center gap-1 ${formDataChecks.password.lowercase ? "text-success" : "text-destructive"}`}>
                                    {formDataChecks.password.lowercase ? <CheckIcon /> : <XIcon />}
                                    <span> Password must contain a lowercase letter </span>
                                </div>
                                <div className={`flex items-center gap-1 ${formDataChecks.password.digit ? "text-success" : "text-destructive"}`}>
                                    {formDataChecks.password.digit ? <CheckIcon /> : <XIcon />}
                                    <span> Password must contain a number </span>
                                </div>
                                <div className={`flex items-center gap-1 ${formDataChecks.password.specialCharacter ? "text-success" : "text-destructive"}`}>
                                    {formDataChecks.password.specialCharacter ? <CheckIcon /> : <XIcon />}
                                    <div>
                                        Password must contain a special character
                                        <div> (! @ # $ % ^ & * ? + -) </div>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 ${formDataChecks.password.length ? "text-success" : "text-destructive"}`}>
                                    {formDataChecks.password.length ? <CheckIcon /> : <XIcon />}
                                    <span> Password must contain 8-100 characters </span>
                                </div>
                            </div>
                        }

                        {/* <div className="flex h-4 items-center justify-center">
                            {
                                !state?.success &&
                                <span className="error-message mt-1 text-sm text-red-600 text-center font-medium">
                                    {state.errors?.[0] || state.properties?.username?.errors?.[0] || state.properties?.password?.errors?.[0] || state.message || ""}
                                </span>
                            }
                        </div> */}

                        <Field className="gap-4">
                            <Button disabled={!formDataChecks.ok || pending} type="submit">
                                <UserRoundPlusIcon className="w-5 h-5" />
                                <span>Sign up</span>
                            </Button>
                            <FieldDescription className="text-center">
                                <span> Already have an account? </span>
                                <Link href="/login">Login</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form >
            </CardContent>
        </Card>
    )
}

export default SignupForm

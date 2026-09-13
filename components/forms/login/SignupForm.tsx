"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { signup, SignupFormState } from "@/lib/actions/signup";
import PasswordShowToggleIcon from "@/components/buttons/PasswordShowToggleIcon";
import Link from "next/link";
import { UserRoundPlusIcon } from "lucide-react";;
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupPayload } from "@/lib/schemas/signup";

const SignupForm = () => {

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            password: "",
            firstname: "",
            lastname: ""
        },
    })

    const passwordRef = useRef<HTMLInputElement | null>(null)
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null)

    const initialState: SignupFormState = {
        success: false
    }

    const [state, signupAction, pending] = useActionState(signup, initialState)
    const [hidden, setHidden] = useState(true)
    const [passwordsMatch, setPasswordsMatch] = useState(true)

    useEffect(() => {
        if (state.success) {
            toast.add({
                type: "success",
                description: "Account created successfully"
            })
            redirect("/login")
        } else if (state.message || state.formErrors?.[0]) {
            toast.add({
                type: "error",
                description: state.message || state.error || state.formErrors?.[0] || "Something went wrong"
            })
        }
    }, [state])

    const checkPasswordsMatch = () => {
        const password = passwordRef.current?.value
        const confirmPassword = confirmPasswordRef.current?.value
        setPasswordsMatch(!password || !confirmPassword || password === confirmPassword)
    }

    const handleSubmit = (data: SignupPayload) => {
        const formData = new FormData();
        formData.append("firstname", data.firstname);
        formData.append("lastname", data.lastname);
        formData.append("username", data.username);
        formData.append("password", data.password);
        startTransition(() => signupAction(formData))
    }

    return (
        <Card className="w-full max-w-sm p-6">
            <CardHeader className="text-center">
                <CardTitle>Create an account</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <FieldGroup className="flex flex-col gap-6 mt-2">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Controller
                                name="firstname"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} required />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="lastname"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                                        <Input {...field} id={field.name} required />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                                    <Input {...field} id={field.name} minLength={5} aria-invalid={fieldState.invalid} required />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput {...field} id={field.name} type={hidden ? "password" : "text"} ref={passwordRef} required
                                            minLength={8} maxLength={100} aria-invalid={fieldState.invalid} onChange={e => {
                                                field.onChange(e)
                                                checkPasswordsMatch()
                                            }}
                                        />
                                        <InputGroupAddon>
                                            <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {
                                        fieldState.invalid ?
                                            <FieldError errors={[fieldState.error]} />
                                            :
                                            <FieldDescription>
                                                Password must contain an uppercase letter, lowercase letter, digit and special character <br />
                                                (! @ # $ % ^ & * ? + -)
                                            </FieldDescription>
                                    }
                                </Field>
                            )}
                        />

                        <Field data-invalid={!passwordsMatch}>
                            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput id="confirmPassword" type={hidden ? "password" : "text"} ref={confirmPasswordRef} required
                                    aria-invalid={!passwordsMatch} onChange={checkPasswordsMatch}
                                />
                                <InputGroupAddon>
                                    <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                                </InputGroupAddon>
                            </InputGroup>
                            {!passwordsMatch && <FieldError>Passwords do not match</FieldError>}
                        </Field>

                        <Field className="gap-4">
                            <Button disabled={pending} type="submit">
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

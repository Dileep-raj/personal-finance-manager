"use client";

import { useActionState, useEffect, useState } from "react";
import { login } from "@/lib/actions/login";
import { LogInIcon } from "lucide-react";
import PasswordShowToggleIcon from "@/components/buttons/PasswordShowToggleIcon";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast";

const LoginForm = () => {
    const [state, loginAction, pending] = useActionState(login, undefined)
    const [hidden, setHidden] = useState(true)

    useEffect(() => {
        if (state?.errors?.message) toast.add({
            type: "error",
            description: state?.errors?.message || "Invalid username or password"
        })
    }, [state])

    return (
        <Card className="w-full max-w-sm p-6">
            <CardHeader className="text-center">
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={loginAction}>
                    <FieldGroup className="flex flex-col gap-8 mt-2">
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input name="username" id="username" type="username" required />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput name="password" id="password" required type={hidden ? "password" : "text"} autoComplete="current-password" />
                                <InputGroupAddon align="inline-end">
                                    <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>

                        {/* <div className="flex h-4 items-center justify-center">
                            {state?.errors?.message && <span className="error-message mt-1 text-sm text-red-600 text-center font-medium">{state.errors.message}</span>}
                        </div> */}

                        <Field className="gap-4">
                            <Button disabled={pending} type="submit" className="w-full">
                                <LogInIcon className="w-5 h-5" />
                                Login
                            </Button>
                            <FieldDescription className="text-center">
                                <span> Don&apos;t have an account? </span>
                                <Link href="/signup">Sign up</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default LoginForm

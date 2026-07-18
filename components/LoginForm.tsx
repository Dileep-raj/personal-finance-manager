"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { login } from "@/lib/actions/login";

const SubmitButton = ({ disabled = false }: { disabled?: boolean }) => {
    const { pending } = useFormStatus();
    return <button disabled={disabled || pending} type="submit" className="px-3 py-2 bg-blue-500 mx-auto rounded text-white cursor-pointer m-3 disabled:pointer-events-none disabled:opacity-50"> Submit </button>
}

const LoginForm = () => {
    const [state, loginAction] = useActionState(login, undefined)

    return (
        <form action={loginAction}>
            <div className="flex flex-col justify-center m-4">
                <input className="py-2 px-3 rounded border m-3" type="text" name="username" id="username" placeholder="Username" required />
                <input className="py-2 px-3 rounded border m-3" type="password" name="password" id="password" placeholder="Password" required />
                {state?.errors?.message && <span className="error-message mt-1 text-sm text-red-600 text-center font-medium">{state.errors.message}</span>}
                <SubmitButton />
            </div>
        </form>
    )
}

export default LoginForm

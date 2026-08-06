"use client";

import { useActionState, useState } from "react";
import { login } from "@/lib/actions/login";
import { LogInIcon } from "lucide-react";
import PasswordShowToggleIcon from "@/components/buttons/PasswordShowToggleIcon";
import Link from "next/link";

const LoginForm = () => {
    const [state, loginAction, pending] = useActionState(login, undefined)
    const [hidden, setHidden] = useState(true)

    return (
        <form action={loginAction} className="mt-10 gap-4 sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center p-10 rounded-2xl border">
            <div className="text-center mb-4">
                <h4 className="text-xl font-medium text-gray-800">Login</h4>
            </div>

            <div>
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900"> Username </label>
                <div className="mt-2">
                    <input id="username" name="username" type="username" required autoComplete="username"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900"> Password </label>
                <div className="mt-2 relative flex">
                    <input id="password" name="password" type={hidden ? "password" : "text"} required autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    <PasswordShowToggleIcon className="cursor-pointer absolute right-1 self-center p-2 z-10" hidden={hidden} onClick={() => setHidden(!hidden)} />
                </div>
            </div>

            <div className="flex h-4 items-center justify-center">
                {state?.errors?.message && <span className="error-message mt-1 text-sm text-red-600 text-center font-medium">{state.errors.message}</span>}
            </div>

            <button disabled={pending} type="submit"
                className="flex w-full items-center justify-center px-3 py-1.5 text-sm/6 font-semibold shadow-xs bg-blue-500 hover:bg-blue-400 mx-auto rounded-md text-white cursor-pointer m-3 disabled:pointer-events-none disabled:opacity-50">
                <LogInIcon className="w-5 h-5 mr-2" />
                <span> Login </span>
            </button>

            <div className="self-center font-medium text-sm">
                <span> Don&apos;t have an account? </span>
                <Link href="/signup" className="text-blue-500">Signup</Link>
            </div>
        </form >
    )
}

export default LoginForm

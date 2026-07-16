"use client";

import { useFormStatus } from "react-dom";

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return <button disabled={pending} type="submit" className="px-3 py-2 bg-blue-500 mx-auto rounded text-white cursor-pointer m-3">
        {pending && <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>}
        Submit
    </button>
}

const LoginForm = () => {
    return (
        <form method="post">
            <div className="flex flex-col justify-center m-4">
                <input className="py-2 px-3 rounded border m-3" type="text" name="username" id="username" placeholder="Username" />
                <input className="py-2 px-3 rounded border m-3" type="password" name="password" id="password" placeholder="Password" />
                <SubmitButton />
            </div>
        </form>
    )
}

export default LoginForm

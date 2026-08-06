import "@/app/globals.css";
import { ToastContainer } from "react-toastify";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
            <ToastContainer position="bottom-center" hideProgressBar={true} />
        </>
    );
}

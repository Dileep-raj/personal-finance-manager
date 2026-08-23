import Navbar from "@/components/header/Navbar";
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
            <ToastContainer position="bottom-center" hideProgressBar={true} />
        </>
    );
}

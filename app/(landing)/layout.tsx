import "@/app/globals.css";
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/header/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import UserProvider from "@/hooks/use-user-context";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <UserProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <Navbar />
                    <main className="w-full">
                        {/* <SidebarTrigger className="m-2 size-8" /> */}
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </UserProvider>
    );
}

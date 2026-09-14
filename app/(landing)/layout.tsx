import "@/app/globals.css";
import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UserProvider from "@/hooks/use-user-context";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <UserProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <main className="w-full">
                        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                            </div>
                        </header>
                        {/* <SidebarTrigger className="m-2 size-8" /> */}
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </UserProvider>
    );
}

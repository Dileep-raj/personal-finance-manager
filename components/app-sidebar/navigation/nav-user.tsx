"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { logout } from "@/lib/actions/login"
import { UserDetails } from "@/lib/types/ui/user"
import { ChevronsUpDownIcon, UserRoundIcon, LogOutIcon } from "lucide-react"

interface NavUserProps {
    user: UserDetails
}

export function NavUser({ user }: Readonly<NavUserProps>) {
    const { isMobile } = useSidebar()
    const fullname = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim()
    const userAvatar = <>
        <Avatar>
            <AvatarImage src={""} alt={user.firstname} />
            <AvatarFallback>{
                fullname
                    ? [user.firstname, user.lastname].map(s => s.charAt(0)).join("").toUpperCase()
                    : <UserRoundIcon className="w-4" />
            }</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2 px-1 text-left text-sm">
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{fullname}</span>
                {/* <span className="truncate text-xs">{user.username}</span> */}
            </div>
        </div>
    </>
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}>
                        {userAvatar}
                        <ChevronsUpDownIcon className="ml-auto size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-fit" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex items-center gap-1 text-left text-sm">
                                    {userAvatar}
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOutIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

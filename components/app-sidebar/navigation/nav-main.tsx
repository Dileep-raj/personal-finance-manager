"use client"

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import { NavMenuGroup } from "@/components/app-sidebar/types/nav-menu"
import Link from "next/link"

interface NavMainProps {
    items: Array<NavMenuGroup>
}

export function NavMain({ items }: Readonly<NavMainProps>) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Manage Expenses</SidebarGroupLabel>
            <SidebarMenu>
                {
                    items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton render={<Link href={item.url ?? "#"} />} isActive={item.isActive}>
                                {item.icon}
                                {item.title}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))
                }
            </SidebarMenu>
        </SidebarGroup>
    )
}

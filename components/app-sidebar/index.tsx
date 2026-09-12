"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { NavUser } from '@/components/app-sidebar/navigation/nav-user'
import { useState } from 'react'

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const [user, setUser] = useState({
        name: "Name",
        username: "username",
        avatar: "",
    })

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar

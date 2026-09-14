"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { NavUser } from '@/components/app-sidebar/navigation/nav-user'
import { useEffect } from 'react'
import { useUser, useUserUpdate } from '@/hooks/use-user-context'
import { getCurrentUserDetails } from '@/lib/actions'
import { NavMain } from './navigation/nav-main'
import { NavMenuGroup } from '@/components/app-sidebar/types/nav-menu'
import { LayoutDashboardIcon, WalletCardsIcon } from 'lucide-react'

const navMenuItems: Array<NavMenuGroup> = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: <LayoutDashboardIcon />
    },
    {
        title: 'Expenses',
        url: '/expense',
        icon: <WalletCardsIcon />
    },
]

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const user = useUser()
    const setUser = useUserUpdate()

    useEffect(() => {
        if (user.username) return
        async function getUser() {
            const userDetails = await getCurrentUserDetails()
            console.log(userDetails)
            if (userDetails) setUser(userDetails)
        }
        getUser()
    }, [user, setUser])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMenuItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar

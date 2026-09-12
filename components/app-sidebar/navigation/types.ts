type NavbarMenuNavigationItem = {
    url?: string
}

type NavbarMenuActionItem = {
    action?: (...args: unknown[]) => unknown
}

export interface NavbarMenuItemProps extends NavbarMenuNavigationItem, NavbarMenuActionItem {
    title: string
    icon?: React.ReactNode
    isActive?: boolean
}

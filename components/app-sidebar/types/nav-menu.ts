interface NavMenuLinkOrActionItem {
    title: string
    url?: string
    icon?: React.ReactNode
    isActive?: boolean
    action?: (...args: unknown[]) => unknown
}

export interface NavMenuGroup extends NavMenuLinkOrActionItem {
    items?: NavMenuLinkOrActionItem[]
}

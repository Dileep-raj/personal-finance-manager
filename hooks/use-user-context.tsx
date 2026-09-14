"use client"

import { UserDetails } from '@/lib/types/ui/user'
import { createContext, useContext, useState } from 'react'

export const UserContext = createContext<UserDetails | undefined>(undefined)
export const UserUpdateContext = createContext<((user: UserDetails) => void) | null>(null)

export const useUser = () => {
    const user = useContext(UserContext)
    if (!user) throw new Error("useUser must be used within a UserProvider")
    return user
}

export const useUserUpdate = () => {
    const setUser = useContext(UserUpdateContext)
    if (!setUser) throw new Error("useUserUpdate must be used within a UserProvider")
    return setUser
}

const UserProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [user, setUser] = useState<UserDetails>({
        firstname: "",
        lastname: "",
        username: "",
    })

    return (
        <UserContext value={user}>
            <UserUpdateContext value={setUser}>
                {children}
            </UserUpdateContext>
        </UserContext >
    )
}

export default UserProvider

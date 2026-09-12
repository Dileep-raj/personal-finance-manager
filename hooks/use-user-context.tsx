import { createContext, useContext, useState } from 'react'

interface User {
    name?: string,
    username: string,
    avatar?: string,
}

export const UserContext = createContext<User | undefined>(undefined)
export const UserUpdateContext = createContext<((user: User) => void) | null>(null)

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
    const [user, setUser] = useState<User>({
        name: "",
        username: "",
        avatar: "",
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

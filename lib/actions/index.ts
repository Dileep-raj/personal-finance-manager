"use server"

import { cookies } from "next/headers";
import { getSessionUsername } from "@/lib/actions/session";
import { getUserByUsername } from "@/lib/actions/user"
import { UserDetails } from "../types/ui/user";

export const getCurrentUserDetails = async () => {
    const username = await getSessionUsername(await cookies())
    if (!username) return
    const user = (await getUserByUsername(username)).toObject()
    const { firstname, lastname } = user
    return { username, firstname, lastname } as UserDetails
}

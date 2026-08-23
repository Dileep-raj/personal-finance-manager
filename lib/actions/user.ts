import User from "@/lib/mongodb/models/user.model";

export const getUserByUsername = async (username: string) => {
    return await User.findOne({ username })
}

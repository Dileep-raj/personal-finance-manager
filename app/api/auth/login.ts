import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export const login = async (username: string, password: string) => {
    try {
        await connectToDatabase()
        const user = await User.findOne({ username })

        // Invalid username or password
        if (!user || !user.validPassword(password)) NextResponse.json({ success: false, message: "Invalid username or password" })

        NextResponse.json({
            success: true,
            message: "Login successful",
            data: "username"
        })
    } catch (error) {
        console.error("Failed attempt to login!", error)
        NextResponse.json({
            success: false,
            message: "An unexpected error occurred"
        }, { status: 500 })
    }
}

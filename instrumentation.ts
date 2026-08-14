import { connectToDatabase } from "@/lib/mongodb/mongoose"


export async function register() {
    console.log("Server starting up...")
    const connection = await connectToDatabase()
    if (connection) console.log("Connected to MongoDB successfully")
    else {
        throw new Error("MongoDB connection failed!\nExiting server")
    }
}


import mongoose, { ConnectOptions } from 'mongoose';

// MongoDB URI cannot be null/undefined
const uri = process.env.MONGODB_URI;

if (!uri) throw new Error("MongoDB URI not found!")

const clientOptions: ConnectOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
}

export const connectToDatabase = async () => {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        if (!await mongoose.connect(uri, clientOptions)) return false;
        return true;
    } catch (error) {
        console.error("Failed connecting to MongoDB!:", error)
        return false
    }
}

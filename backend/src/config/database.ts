import mongoose from "mongoose";
import dns from "dns";

export const connectDB = async () => {
    if (process.env.NODE_ENV !== "production") {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
    }

    const uri = process.env.MONGODB_URI as string;

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
}
import mongoose from "mongoose";
import { User } from "../models/User";
import dns from "dns";

const SEED_USERS = [
    {
        clerkId: "seed_user_11",
        name: "Lucas Fernández",
        email: "lucas.fernandez@example.com",
        avatar: "https://i.pravatar.cc/150?img=21",
    },
    {
        clerkId: "seed_user_12",
        name: "María López",
        email: "maria.lopez@example.com",
        avatar: "https://i.pravatar.cc/150?img=22",
    },
    {
        clerkId: "seed_user_13",
        name: "Daniel Kim",
        email: "daniel.kim@example.com",
        avatar: "https://i.pravatar.cc/150?img=23",
    },
    {
        clerkId: "seed_user_14",
        name: "Valentina Rossi",
        email: "valentina.rossi@example.com",
        avatar: "https://i.pravatar.cc/150?img=24",
    },
    {
        clerkId: "seed_user_15",
        name: "Andrés Morales",
        email: "andres.morales@example.com",
        avatar: "https://i.pravatar.cc/150?img=25",
    },
    {
        clerkId: "seed_user_16",
        name: "Noah Peterson",
        email: "noah.peterson@example.com",
        avatar: "https://i.pravatar.cc/150?img=26",
    },
    {
        clerkId: "seed_user_17",
        name: "Camila Soto",
        email: "camila.soto@example.com",
        avatar: "https://i.pravatar.cc/150?img=27",
    },
    {
        clerkId: "seed_user_18",
        name: "Hiroshi Tanaka",
        email: "hiroshi.tanaka@example.com",
        avatar: "https://i.pravatar.cc/150?img=28",
    },
    {
        clerkId: "seed_user_19",
        name: "Sofía Ramírez",
        email: "sofia.ramirez@example.com",
        avatar: "https://i.pravatar.cc/150?img=29",
    },
    {
        clerkId: "seed_user_20",
        name: "Alexander Müller",
        email: "alexander.muller@example.com",
        avatar: "https://i.pravatar.cc/150?img=30",
    },
];


async function seed() {
    try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined");
        }
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");

        const users = await User.insertMany(SEED_USERS);
        console.log(`Seeded ${users.length} users:`);

        users.forEach((user) => {
            console.log(`   - ${user.name} (${user.email})`);
        });

        await mongoose.disconnect();
        console.log("Done!");
    } catch (error) {
        console.error("Seed error:", error);
    }
}

seed();
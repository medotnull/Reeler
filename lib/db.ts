import mongoose, { Connection } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
    throw new Error("Please define MONGODB_URL in your environment");
}

type MongooseCache = {
    conn: Connection | null;
    promise: Promise<Connection> | null;
};

declare global {
    var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export async function connectToDB(): Promise<Connection> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        } as const;

        cached.promise = mongoose
            .connect(MONGODB_URL, opts)
            .then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}
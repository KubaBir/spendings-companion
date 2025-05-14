import mongoose, { Connection, Mongoose } from 'mongoose';

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
    conn: Connection | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Initialize the global mongoose cache if not exists
if (!global.mongoose) {
    global.mongoose = cached;
}

/**
 * Connect to MongoDB and cache the connection
 * @returns MongoDB connection
 */
async function dbConnect(): Promise<Connection> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
            return mongoose;
        });
    }

    const mongooseInstance: Mongoose = await cached.promise;
    cached.conn = mongooseInstance.connection;

    console.log('Connected to db');

    return cached.conn;
}

export default dbConnect;

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI && process.env.NODE_ENV === 'production') {
  throw new Error('Please define the MONGO_URI environment variable inside .env');
}

/**
 * Global connection cache to prevent multiple connections during Next.js hot reloading.
 */
interface GlobalMongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: GlobalMongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectMongoDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGO_URI || MONGO_URI;

  // If password placeholder is still present, return null or fallback without crashing server boot
  if (!uri || uri.includes('<PASSWORD>')) {
    console.warn('MongoDB connection paused: MONGO_URI password placeholder (<PASSWORD>) detected in .env');
    return null;
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(uri, opts).then((m) => {
      console.log('Successfully connected to MongoDB Atlas!');
      return m;
    }).catch((err) => {
      console.error('MongoDB Atlas Connection Error:', err);
      cached!.promise = null;
      throw err;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectMongoDB;

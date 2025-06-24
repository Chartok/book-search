
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

<<<<<<< HEAD
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
	console.log('MongoDB connected successfully');
});

export default db;
=======
if (!MONGODB_URI) throw new Error('MongoDB URI not set in environment variables');

interface MongooseGlobal {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}
const globalWithMongoose = global as typeof global & MongooseGlobal;
const cached = globalWithMongoose.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
>>>>>>> 6b36f2de9d46905062e2ab1260eedf8f21675362

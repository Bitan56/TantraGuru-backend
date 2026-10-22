import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false); // Fail fast, don't hang if no MongoDB
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      console.warn('[AI Studio] MONGO_URI not provided — running in offline database mode');
      return;
    }
    await mongoose.connect(uri);
    console.log('[Database] MongoDB Connected successfully');
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed (${error.message}) — running in offline mode`);
  }
};
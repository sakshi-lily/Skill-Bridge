import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  mongoose.set('bufferCommands', false);

  if (!uri) {
    console.warn('\n⚠️ [Database Warning]: MONGODB_URI is not defined in environment variables.');
    console.warn('ℹ️ Please set MONGODB_URI in server/.env (e.g., mongodb+srv://<user>:<password>@cluster.mongodb.net/skillbridge).');
    console.warn('ℹ️ Running in Memory/Mock-compatible mode for safe local evaluation.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host} (${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.warn('ℹ️ Server will continue running. Check database credentials or network access.\n');
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => {
  return {
    connected: isConnected,
    readyState: mongoose.connection.readyState,
  };
};

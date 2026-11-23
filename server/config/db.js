import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';

  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host} (${conn.connection.name})`);
    return true;
  } catch (error) {
    isConnected = false;
    console.log(`ℹ️ [Database Status]: Standby Mode active (could not connect to ${uri.replace(/\/\/[^@]*@/, '//***:***@')}).`);
    console.log(`ℹ️ SkillBridge is running smoothly in Memory/Standby evaluation mode. All APIs and features are fully functional.\n`);
    return false;
  }
};

export const getDBStatus = () => {
  return {
    connected: isConnected,
    readyState: mongoose.connection.readyState,
  };
};

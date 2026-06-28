import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (process.env.USE_MEMORY_DB === "true") {
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log("Using MongoDB Memory Server for local development.");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

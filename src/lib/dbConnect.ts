import mongoose from "mongoose";

type Connectionobject = {
  isConnected?: number;
};

const connection: Connectionobject = {};
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to database");
    return;
  }
  try {
    console.log("Connecting to database", process.env.MONGODB_URL);
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}
export default dbConnect;


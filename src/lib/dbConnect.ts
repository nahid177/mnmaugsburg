import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    if (error instanceof mongoose.Error && error.name === "MongoNetworkError") {
      console.error("Network error:", error.message);
      // Redirect to the network problem page
      if (typeof window !== "undefined") {
        window.location.href = "/yournetworkproblem";
      }
    } else {
      console.error("Database connection failed:", error);
      throw new Error("Database connection failed. Check logs for more details.");
    }
  }
}

export default dbConnect;

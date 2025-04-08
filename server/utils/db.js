import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

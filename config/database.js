import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  // if the database is already connected don't connect again
  if (connected) {
    console.log("MongoDB is already connected...");
    return;
  }

  // connect to mongoose
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("Mongodb connected...");
  } catch (error) {
    console.log("Error connecting to mongodb", error);
  }
};

export default connectDB;

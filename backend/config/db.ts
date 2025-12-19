import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (!process.env.DB_URL) {
      console.log("database url not found");
      return;
    }
    await mongoose.connect(process.env.DB_URL);
    console.log("database connected");
  } catch (error) {
    console.log("error while connecting with db : ", error);
    return;
  }
};

export default connectDb;
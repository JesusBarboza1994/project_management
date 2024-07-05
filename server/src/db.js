import mongoose from "mongoose";
import config from "./config.js";


export default async function connectDB() {
    try {
      await mongoose.connect(config.DATABASE_URL, { });
      console.log("Conectado a MongoDB");
    } catch(err) {
      console.log("ERROR",err);
    }  
}
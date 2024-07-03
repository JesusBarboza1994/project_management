import mongoose from "mongoose";
import config from "./config.js";


export default function connectDB() {
    try {
      const db = mongoose.connect(config.DATABASE_URL, { });
      console.log("Conectado a MongoDB", db.connection.host);
    } catch(err) {
      console.log("ERROR",err);
    }  
}
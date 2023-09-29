const isProduction = process.env.NODE_ENV !== "dev";
const DATABASE_URL = isProduction ? process.env.MONGO_URL : process.env.MONGODB_URI
const PORT = isProduction ? process.env.MONGOPORT : process.env.PORT 
module.exports = {
  DATABASE_URL,
  PORT
};
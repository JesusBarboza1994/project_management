const isProduction = process.env.NODE_ENV !== "dev";
const DATABASE_URL = isProduction ? process.env.MONGO_URL : process.env.MONGODB_URI
const PORT = process.env.PORT || 3000
const config = {
  DATABASE_URL, 
  PORT
}

export default config
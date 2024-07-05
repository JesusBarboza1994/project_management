const isProduction = process.env.NODE_ENV !== "dev";
const DATABASE_URL = isProduction ? process.env.MONGO_URL : process.env.MONGODB_URI
const PORT = process.env.PORT || 3000

const config = {
  DATABASE_URL, 
  PORT,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_TOKEN,
  secretAccesTime: process.env.APP_SECRET_ACCESS_TIME,
 
}

export default config
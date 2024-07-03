const isProduction = process.env.NODE_ENV !== "dev";
const DATABASE_URL = isProduction ? process.env.MONGO_URL : process.env.MONGODB_URI

const config = {
  DATABASE_URL
}

export default config
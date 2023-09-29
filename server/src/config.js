const isProduction = process.env.NODE_ENV !== "dev";
const DATABASE_URL = isProduction ? process.env.MONGO_URL : process.env.MPONGODB_URI
const config = {
  DATABASE_URL
}

module.exports = {
  DATABASE_URL
};
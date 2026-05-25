require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.error("Missing required env var: MONGO_URI");
  process.exit(1);
}

const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI,
  origin: process.env.ORIGIN || "http://localhost:5173",
};

module.exports = config;

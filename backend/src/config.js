require("dotenv").config();

const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/live-code-classroom",
  origin: process.env.ORIGIN || "http://localhost:5173",
};

module.exports = config;

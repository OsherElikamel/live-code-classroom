const mongoose = require("mongoose");

const TEST_MONGO_URI =
  process.env.TEST_MONGO_URI || "mongodb://localhost:27017/classroom-test";

async function connectTestDB() {
  await mongoose.connect(TEST_MONGO_URI);
}

async function disconnectTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}

async function cleanCollections() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

module.exports = { connectTestDB, disconnectTestDB, cleanCollections };

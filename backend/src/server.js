const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const config = require("./config");
const app = require("./app");
const socketHandler = require("./socket");

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: config.origin, methods: ["GET", "POST"] },
});

socketHandler(io);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

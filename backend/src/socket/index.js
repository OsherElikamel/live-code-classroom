const { handleJoinRoom } = require("../services/socket.service");

module.exports = (io) => {
  const rooms = {};

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      if (socket._joined) return;
      socket._joined = true;
      handleJoinRoom(rooms, socket, roomId, io).catch((err) => {
        console.error("Error joining room:", err.message);
        socket.emit("error", "Failed to join room");
      });
    });
  });
};

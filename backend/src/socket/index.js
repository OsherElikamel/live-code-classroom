const { handleJoinRoom } = require("../services/socket.service");

module.exports = (io) => {
  const rooms = {};

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      handleJoinRoom(rooms, socket, roomId, io);
    });
  });
};

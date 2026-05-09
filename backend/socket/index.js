const { handleJoinRoom } = require('../services/socketService');

module.exports = (io) => {
  const rooms = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId) => {
      handleJoinRoom(rooms, socket, roomId, io);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

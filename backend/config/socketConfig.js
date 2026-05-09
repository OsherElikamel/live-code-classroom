const { Server } = require('socket.io');

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  return io;
};

module.exports = configureSocket;

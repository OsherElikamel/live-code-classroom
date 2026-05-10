const CodeBlock = require("../models/CodeBlock");

exports.handleJoinRoom = async (rooms, socket, roomId, io) => {
  if (!rooms[roomId]) {
    const codeBlock = await CodeBlock.findById(roomId);
    rooms[roomId] = { mentor: null, students: [], code: codeBlock?.initialCode || "" };
  }

  const room = rooms[roomId];
  const isMentor = !room.mentor;
  const role = isMentor ? "mentor" : "student";

  if (isMentor) {
    room.mentor = socket.id;
  } else {
    room.students.push(socket.id);
  }

  socket.emit("assign-role", role);
  socket.join(roomId);
  socket.emit("code-update", room.code);

  socket.on("code-update", (updatedCode) => {
    room.code = updatedCode;
    io.to(roomId).emit("code-update", updatedCode);
  });

  const updateStudentCount = () => {
    io.to(roomId).emit("students-count", room.students.length);
  };
  updateStudentCount();

  socket.on("disconnect", () => {
    if (room.mentor === socket.id) {
      room.mentor = null;
      io.to(roomId).emit("mentor-left");
    } else {
      room.students = room.students.filter((id) => id !== socket.id);
    }
    updateStudentCount();

    if (!room.mentor && room.students.length === 0) {
      delete rooms[roomId];
    }
  });
};

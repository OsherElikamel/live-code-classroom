const mongoose = require("mongoose");
const CodeBlock = require("../models/CodeBlock");

exports.handleJoinRoom = async (rooms, socket, roomId, io) => {
  if (
    !roomId ||
    typeof roomId !== "string" ||
    !mongoose.Types.ObjectId.isValid(roomId)
  ) {
    socket.emit("error", "Invalid room ID");
    return;
  }

  // Reserve the room and assign the role synchronously — doing the
  // check-then-create across an await lets two simultaneous joiners
  // each become mentor (TOCTOU race).
  if (!rooms[roomId]) {
    rooms[roomId] = { mentor: null, students: [], code: null };
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

  if (room.code === null) {
    const codeBlock = await CodeBlock.findById(roomId).lean();
    // another joiner may have filled it while we awaited
    if (room.code === null) room.code = codeBlock?.initialCode || "";
  }
  socket.emit("code-update", room.code);

  socket.on("code-update", (updatedCode) => {
    if (typeof updatedCode !== "string") return;
    // The mentor is read-only — enforce it server-side, not just in the UI.
    if (socket.id === room.mentor) return;
    room.code = updatedCode;
    // Exclude the sender: echoing their own keystrokes back arrives after
    // newer local input and causes cursor jumps in the controlled editor.
    socket.to(roomId).emit("code-update", updatedCode);
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

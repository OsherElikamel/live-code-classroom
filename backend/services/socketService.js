exports.handleJoinRoom = (rooms, socket, roomId, io) => {
  if (!rooms[roomId]) {
    rooms[roomId] = { mentor: null, students: [], code: '' };
  }

  const room = rooms[roomId];

  // Assign role and emit it
  const isMentor = !room.mentor; // Mentor is assigned to the first connection
  const role = isMentor ? 'mentor' : 'student';

  if (isMentor) {
    room.mentor = socket.id;
  } else {
    room.students.push(socket.id);
  }

  // Emit the role assignment
  socket.emit('assign-role', role);

  // Join the room by roomId
  socket.join(roomId);

  // Emit the current code state after role assignment
  socket.emit('code-update', room.code);

  // Listen for code updates and broadcast them to others in the room
  socket.on('code-update', (updatedCode) => {
    room.code = updatedCode;
    io.to(roomId).emit('code-update', updatedCode);
  });

  const updateStudentCount = () => {
    const studentCount = room.students.length; // Count of students only
    io.to(roomId).emit('students-count', studentCount);
  };
  updateStudentCount();

  if (!room.mentor && room.students.length === 0) {
    delete rooms[roomId];
  }


  // Handle disconnection
  socket.on('disconnect', () => {
    if (room.mentor === socket.id) {
      room.mentor = null;
      io.to(roomId).emit('mentor-left'); // Notify students that the mentor has left
    } else {
      room.students = room.students.filter((id) => id !== socket.id);
    }
  });
};

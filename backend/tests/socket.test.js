const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const CodeBlock = require("../src/models/CodeBlock");
const socketHandler = require("../src/socket");
const { connectTestDB, disconnectTestDB, cleanCollections } = require("./setup");

let io;
let httpServer;
let port;
let block;
let clients = [];

beforeAll(async () => {
  await connectTestDB();
  httpServer = createServer();
  io = new Server(httpServer);
  socketHandler(io);
  await new Promise((resolve) => httpServer.listen(0, resolve));
  port = httpServer.address().port;
});

afterAll(async () => {
  io.close();
  await disconnectTestDB();
});

beforeEach(async () => {
  block = await CodeBlock.create({
    title: "Test Block",
    description: "A block for socket tests",
    initialCode: "// start here",
    solution: "// done",
  });
});

afterEach(async () => {
  for (const c of clients) c.disconnect();
  clients = [];
  await cleanCollections();
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function joinRoom(roomId) {
  const socket = Client(`http://localhost:${port}`, {
    transports: ["websocket"],
    forceNew: true,
  });
  clients.push(socket);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("join timed out")), 3000);
    socket.on("assign-role", (role) => {
      clearTimeout(timer);
      resolve({ socket, role });
    });
    socket.on("connect", () => socket.emit("join-room", roomId));
  });
}

describe("room joining", () => {
  it("assigns mentor to the first joiner and student to the second", async () => {
    const first = await joinRoom(block.id);
    const second = await joinRoom(block.id);
    expect(first.role).toBe("mentor");
    expect(second.role).toBe("student");
  });

  it("assigns exactly one mentor when two users join simultaneously", async () => {
    const [a, b] = await Promise.all([joinRoom(block.id), joinRoom(block.id)]);
    expect([a.role, b.role].sort()).toEqual(["mentor", "student"]);
  });

  it("sends the initial code to a joiner", async () => {
    const socket = Client(`http://localhost:${port}`, {
      transports: ["websocket"],
      forceNew: true,
    });
    clients.push(socket);
    const code = await new Promise((resolve) => {
      socket.on("code-update", resolve);
      socket.on("connect", () => socket.emit("join-room", block.id));
    });
    expect(code).toBe("// start here");
  });

  it("emits an error for an invalid room id", async () => {
    const socket = Client(`http://localhost:${port}`, {
      transports: ["websocket"],
      forceNew: true,
    });
    clients.push(socket);
    const message = await new Promise((resolve) => {
      socket.on("error", resolve);
      socket.on("connect", () => socket.emit("join-room", "not-an-object-id"));
    });
    expect(message).toBe("Invalid room ID");
  });
});

describe("code sync", () => {
  it("broadcasts student edits to others but never echoes to the sender", async () => {
    const mentor = await joinRoom(block.id);
    const student = await joinRoom(block.id);

    let studentEchoed = false;
    student.socket.on("code-update", (code) => {
      if (code === "student typing") studentEchoed = true;
    });
    const mentorReceived = new Promise((resolve) => {
      mentor.socket.on("code-update", (code) => {
        if (code === "student typing") resolve(code);
      });
    });

    student.socket.emit("code-update", "student typing");

    await expect(mentorReceived).resolves.toBe("student typing");
    await wait(100);
    expect(studentEchoed).toBe(false);
  });

  it("ignores code edits from the mentor (server-enforced read-only)", async () => {
    const mentor = await joinRoom(block.id);
    const student = await joinRoom(block.id);

    let received = false;
    student.socket.on("code-update", (code) => {
      if (code === "mentor hack") received = true;
    });

    mentor.socket.emit("code-update", "mentor hack");
    await wait(150);
    expect(received).toBe(false);
  });

  it("sends the latest room code (not initialCode) to late joiners", async () => {
    const student1Setup = await joinRoom(block.id); // mentor
    const student = await joinRoom(block.id);
    student.socket.emit("code-update", "progress so far");
    await wait(100);
    expect(student1Setup.role).toBe("mentor");

    const late = Client(`http://localhost:${port}`, {
      transports: ["websocket"],
      forceNew: true,
    });
    clients.push(late);
    const code = await new Promise((resolve) => {
      late.socket = late;
      late.on("code-update", resolve);
      late.on("connect", () => late.emit("join-room", block.id));
    });
    expect(code).toBe("progress so far");
  });
});

describe("presence", () => {
  it("notifies students when the mentor leaves", async () => {
    const mentor = await joinRoom(block.id);
    const student = await joinRoom(block.id);

    const notified = new Promise((resolve) => {
      student.socket.on("mentor-left", () => resolve(true));
    });

    mentor.socket.disconnect();
    await expect(notified).resolves.toBe(true);
  });

  it("updates the student count as students join", async () => {
    const mentor = await joinRoom(block.id);

    const countReachedOne = new Promise((resolve) => {
      mentor.socket.on("students-count", (count) => {
        if (count === 1) resolve(count);
      });
    });

    await joinRoom(block.id);
    await expect(countReachedOne).resolves.toBe(1);
  });
});

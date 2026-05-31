const request = require("supertest");
const app = require("../src/app");
const CodeBlock = require("../src/models/CodeBlock");
const { connectTestDB, disconnectTestDB, cleanCollections } = require("./setup");

beforeAll(() => connectTestDB());
afterAll(() => disconnectTestDB());
afterEach(() => cleanCollections());

const SEED_BLOCK = {
  title: "Async Basics",
  description: "Learn async/await",
  initialCode: "async function fetchData() {\n  // TODO\n}",
  solution: "async function fetchData() {\n  return await fetch('/api');\n}",
};

describe("GET /api/codeblocks", () => {
  it("returns all code blocks", async () => {
    await CodeBlock.create(SEED_BLOCK);
    const res = await request(app).get("/api/codeblocks");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Async Basics");
  });

  it("excludes solution from response", async () => {
    await CodeBlock.create(SEED_BLOCK);
    const res = await request(app).get("/api/codeblocks");
    expect(res.status).toBe(200);
    expect(res.body[0]).not.toHaveProperty("solution");
  });
});

describe("GET /api/codeblocks/:id", () => {
  it("returns a single code block", async () => {
    const block = await CodeBlock.create(SEED_BLOCK);
    const res = await request(app).get(`/api/codeblocks/${block._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Async Basics");
    expect(res.body.description).toBe("Learn async/await");
  });

  it("excludes solution from detail response", async () => {
    const block = await CodeBlock.create(SEED_BLOCK);
    const res = await request(app).get(`/api/codeblocks/${block._id}`);
    expect(res.body).not.toHaveProperty("solution");
  });

  it("returns 404 for non-existent code block", async () => {
    const res = await request(app).get("/api/codeblocks/000000000000000000000000");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/codeblocks/:id/check", () => {
  it("returns correct for matching solution", async () => {
    const block = await CodeBlock.create(SEED_BLOCK);
    const res = await request(app)
      .post(`/api/codeblocks/${block._id}/check`)
      .send({ code: SEED_BLOCK.solution });
    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true);
  });

  it("returns incorrect for wrong solution", async () => {
    const block = await CodeBlock.create(SEED_BLOCK);
    const res = await request(app)
      .post(`/api/codeblocks/${block._id}/check`)
      .send({ code: "console.log('wrong');" });
    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(false);
  });
});

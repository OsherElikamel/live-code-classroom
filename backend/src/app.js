const express = require("express");
const cors = require("cors");
const config = require("./config");
const codeBlockRoutes = require("./routes/codeBlocks");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: config.origin, methods: ["GET", "POST"] }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/codeblocks", codeBlockRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

module.exports = app;

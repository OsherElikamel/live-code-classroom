const mongoose = require("mongoose");

const codeBlockSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  initialCode: { type: String, required: true },
  solution: { type: String, required: true },
});

module.exports = mongoose.model("CodeBlock", codeBlockSchema);

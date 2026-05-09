const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
  title: String,
  description: String,
  initialCode: String,
  solution: String,
});

module.exports = mongoose.model('CodeBlock', codeBlockSchema);
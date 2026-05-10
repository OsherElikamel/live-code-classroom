const CodeBlock = require("../models/CodeBlock");

exports.getAllCodeBlocks = async (_req, res, next) => {
  try {
    const codeBlocks = await CodeBlock.find();
    res.json(codeBlocks);
  } catch (error) {
    next(error);
  }
};

exports.getCodeBlockById = async (req, res, next) => {
  try {
    const codeBlock = await CodeBlock.findById(req.params.id);
    if (!codeBlock) {
      return res.status(404).json({ error: "Code block not found" });
    }
    res.json(codeBlock);
  } catch (error) {
    next(error);
  }
};

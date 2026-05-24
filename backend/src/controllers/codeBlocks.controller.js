const CodeBlock = require("../models/CodeBlock");

exports.getAllCodeBlocks = async (_req, res, next) => {
  try {
    const codeBlocks = await CodeBlock.find().select("-solution").lean();
    res.json(codeBlocks);
  } catch (error) {
    next(error);
  }
};

exports.getCodeBlockById = async (req, res, next) => {
  try {
    const codeBlock = await CodeBlock.findById(req.params.id).select("-solution").lean();
    if (!codeBlock) {
      return res.status(404).json({ error: "Code block not found" });
    }
    res.json(codeBlock);
  } catch (error) {
    next(error);
  }
};

exports.checkSolution = async (req, res, next) => {
  try {
    const codeBlock = await CodeBlock.findById(req.params.id).select("solution").lean();
    if (!codeBlock) {
      return res.status(404).json({ error: "Code block not found" });
    }
    const normalize = (s) => s.trim().replace(/\s+/g, " ");
    const correct = normalize(req.body.code || "") === normalize(codeBlock.solution);
    res.json({ correct });
  } catch (error) {
    next(error);
  }
};

const CodeBlock = require('../models/CodeBlock');

exports.getAllCodeBlocks = async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find();
    res.json(codeBlocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch code blocks' });
  }
};

exports.getCodeBlockById = async (req, res) => {
  try {
    const { id } = req.params;
    const codeBlock = await CodeBlock.findById(id); 
    if (codeBlock) {
      res.json(codeBlock);
    } else {
      res.status(404).json({ error: 'Code block not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the code block' });
  }
};
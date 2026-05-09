const express = require('express');
const { getAllCodeBlocks, createCodeBlock, getCodeBlockById  } = require('../controllers/codeBlocksController');

const router = express.Router();

router.get('/', getAllCodeBlocks);
router.get('/:id', getCodeBlockById);

module.exports = router;

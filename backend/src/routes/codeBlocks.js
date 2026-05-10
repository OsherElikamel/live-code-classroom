const express = require("express");
const { getAllCodeBlocks, getCodeBlockById } = require("../controllers/codeBlocks.controller");

const router = express.Router();

router.get("/", getAllCodeBlocks);
router.get("/:id", getCodeBlockById);

module.exports = router;

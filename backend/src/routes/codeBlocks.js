const express = require("express");
const { getAllCodeBlocks, getCodeBlockById, checkSolution } = require("../controllers/codeBlocks.controller");

const router = express.Router();

router.get("/", getAllCodeBlocks);
router.get("/:id", getCodeBlockById);
router.post("/:id/check", checkSolution);

module.exports = router;

const express = require("express");
const { getAllCodeBlocks, getCodeBlockById, checkSolution } = require("../controllers/codeBlocks.controller");
const validateObjectId = require("../middleware/validateId");

const router = express.Router();

router.get("/", getAllCodeBlocks);
router.get("/:id", validateObjectId(), getCodeBlockById);
router.post("/:id/check", validateObjectId(), checkSolution);

module.exports = router;

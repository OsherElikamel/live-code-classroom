const mongoose = require("mongoose");

// Reject malformed ObjectIds up front — otherwise Mongoose throws a
// CastError that surfaces as a 500 for what is really bad user input.
const validateObjectId = (param = "id") => (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params[param])) {
    return res.status(400).json({ error: "Invalid id" });
  }
  next();
};

module.exports = validateObjectId;

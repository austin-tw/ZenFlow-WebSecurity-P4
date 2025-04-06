const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

// Admin-only route
router.get("/protected", authMiddleware, authorize("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome, admin user!" });
});

module.exports = router;

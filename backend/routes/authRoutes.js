const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const {
  registerValidator,
  loginValidator,
  validate,
} = require("../validators/authValidator");

router.post("/register",registerValidator(), validate, registerUser);
router.post("/login", loginValidator(), validate, loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;

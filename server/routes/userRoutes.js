const express  = require("express");
const {
  loginUser,
  registerUser,
  logoutUser,
} = require("../controllers/authController.js");

const router = express.Router();

const { body } = require("express-validator");
const { validate } = require("../middleware/validationMiddleware.js");

// @route   Post  /api/users/register
router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  validate,
  registerUser
);

// @route   Post  /api/users/login
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  validate,
  loginUser
);

// @route   Post  /api/users/logout
router.post("/logout", logoutUser);

module.exports = router;
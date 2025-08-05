const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");


router.use(protect, admin);

// Corresponds to GET /api/users/
router.route("/").get(getUsers);

// Corresponds to GET, PUT, DELETE /api/users/:id
router
  .route("/:id")
  .get(getUserById) // Get a single user's details
  .put(updateUser) // Update a user's details (e.g., role)
  .delete(deleteUser); // Delete a user from the platform

module.exports = router;

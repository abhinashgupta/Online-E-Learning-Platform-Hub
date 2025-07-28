const User  = require("../models/User.js");
const generateToken = require("../utils/generateToken.js");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res,next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res,next) => {
 try {
   const { email, password } = req.body;

   const user = await User.findOne({ email });

   if (user && (await user.matchPassword(password))) {
     res.status(200).json({
       _id: user._id,
       name: user.name,
       email: user.email,
       role: user.role,
       token: generateToken(user._id),
     });
   } else {
     res.status(401);
     throw new Error("Invalid email or password");
   }
 } catch (error) {
   next(error);
 }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
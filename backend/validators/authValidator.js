const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidator = () => [
  body("name", "Name is required").not().isEmpty().trim().escape(),
  body("email", "Please include a valid email").isEmail().normalizeEmail(),
  body("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),
];

const loginValidator = () => [
  body("email", "Please include a valid email").isEmail().normalizeEmail(),
  body("password", "Password is required").exists(),
];

const courseValidator = () => [
  body("title", "Title is required").not().isEmpty().trim().escape(),
  body("description", "Description with at least 10 characters is required")
    .isLength({ min: 10 })
    .trim()
    .escape(),
];

const lessonValidator = () => [
  body("title", "Lesson title is required").not().isEmpty().trim().escape(),
  body("content").optional().trim().escape(),
  body("videoUrl").optional().isURL().withMessage("Must be a valid URL"),
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  courseValidator,
  lessonValidator,
};

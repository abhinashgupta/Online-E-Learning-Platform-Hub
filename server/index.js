const express = require ("express");
const dotenv = require ("dotenv");
const cors = require ("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDB = require ("./config/db.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

const path = require("path");

// Route files
const userRoutes = require ("./routes/userRoutes.js");
const courseRoutes = require ("./routes/courseRoutes.js");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(helmet());

app.use(limiter);


// TEMPORARY DEBUG ROUTE - REMOVE AFTER FIXING
app.get('/debug-env', (req, res) => {
  console.log('--- DEBUGGING ENVIRONMENT VARIABLES ---');
  console.log('My JWT_SECRET is:', process.env.JWT_SECRET);
  console.log('My MONGO_URI is:', process.env.MONGO_URI ? 'Set' : 'Not Set');
  console.log('My NODE_ENV is:', process.env.NODE_ENV);
  res.send('Debug information has been logged to the server console.');
});

// Main Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

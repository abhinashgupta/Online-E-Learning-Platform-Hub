const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "elearning-thumbnails", // The name of the folder in Cloudinary
    allowed_formats: ["jpeg", "jpg", "png"], // Allowed image formats
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional: resize images
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

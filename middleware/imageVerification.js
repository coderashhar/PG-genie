const { verifyImage } = require("../utils/imageVerification");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ExpressError = require("../utils/ExpressError");

// Set up temporary storage for verification
const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Create multer upload for temporary files
const tempUpload = multer({ storage: tempStorage });

/**
 * Middleware to verify images before uploading to Cloudinary
 */
const verifyImageContent = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const verificationPromises = req.files.map(async (file) => {
      const result = await verifyImage(file.path);
      if (!result.isSafe) {
        throw new ExpressError(
          `Image "${file.originalname}" contains inappropriate content and cannot be uploaded`,
          400
        );
      }
      return result;
    });

    await Promise.all(verificationPromises);
    next();
  } catch (error) {
    // Clean up temporary files
    req.files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    });

    // Pass error to error handler
    return next(error);
  }
};

// Middleware for cleaning up temporary files after upload to Cloudinary
const cleanupTempFiles = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    });
  }
  next();
};

module.exports = {
  tempUpload,
  verifyImageContent,
  cleanupTempFiles,
};

// Import dependencies
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const sightengine = require("sightengine")(
  process.env.SIGHTENGINE_API_USER,
  process.env.SIGHTENGINE_API_SECRET
); // Replace with your Sightengine credentials

/**
 * Verifies if an image is valid and appropriate for upload
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Object>} - Returns verification result with isSafe property
 */
const verifyImage = async (imagePath) => {
  try {
    // Perform basic file validation
    const stats = fs.statSync(imagePath);
    const fileExtension = path.extname(imagePath).toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    const isValidType = validExtensions.includes(fileExtension);
    const isValidSize = stats.size <= 5 * 1024 * 1024; // 5MB max

    if (!isValidType || !isValidSize) {
      return {
        isSafe: false,
        message: `Image validation failed: ${
          !isValidType ? "Invalid file type" : "File too large"
        }`,
      };
    }

    // Additional image validation using Jimp
    try {
      // Read the image to validate it can be processed
      const image = await Jimp.read(imagePath);

      // Check image dimensions (reject extremely small images that might be invalid)
      const { width, height } = image.bitmap;
      if (width < 50 || height < 50) {
        return {
          isSafe: false,
          message: "Image is too small or may be corrupted",
        };
      }

      // Check if image is too large in dimensions (might be wasteful)
      if (width > 5000 || height > 5000) {
        return {
          isSafe: false,
          message: "Image dimensions are too large",
        };
      }

      // Additional check: Ensure the image can be processed
      await image.resize(200, 200).getBufferAsync(Jimp.MIME_JPEG);

      // NSFW detection using Sightengine instead of TensorFlow
      try {
        // Use Sightengine to check for inappropriate content
        const result = await sightengine.check(["nudity"]).set_file(imagePath);

        // Log the actual scores for debugging
        console.log("Sightengine result:", JSON.stringify(result, null, 2));

        // Determine if the image is safe based on nudity scores
        const nsfwScore = Math.max(
          result.nudity?.raw || 0,
          result.nudity?.partial || 0
        );

        console.log(`NSFW score: ${nsfwScore}`);

        // Increase threshold to reduce false positives (0.4 → 0.7)
        const isSafe = nsfwScore < 0.7;

        return {
          isSafe,
          predictions: result,
          message: isSafe
            ? "Image is safe"
            : `Image contains inappropriate content ${nsfwScore}`,
          dimensions: { width, height },
        };
      } catch (error) {
        console.error("Error during NSFW detection:", error);
        // Fall back to basic validation if NSFW detection fails
        return {
          isSafe: true,
          message:
            "Image validated (NSFW detection failed, using basic validation)",
          fallback: true,
          error: error.message,
          dimensions: { width, height },
        };
      }
    } catch (imageError) {
      console.error("Error processing image with Jimp:", imageError);
      return {
        isSafe: false,
        message: "Failed to process image, it may be corrupted",
        error: imageError.message,
      };
    }
  } catch (error) {
    console.error("Error verifying image:", error);
    throw new Error("Failed to verify image content: " + error.message);
  }
};

module.exports = {
  verifyImage,
};

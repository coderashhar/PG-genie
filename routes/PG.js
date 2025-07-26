const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const PG = require("../controllers/PG.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const {
  tempUpload,
  verifyImageContent,
  cleanupTempFiles,
} = require("../middleware/imageVerification");

const { isLoggedIn, validatePG, isAuthor } = require("../middleware.js");

router
  .route("/")
  .get(catchAsync(PG.index))
  // Replace the direct upload with our verification pipeline
  .post(
    isLoggedIn,
    tempUpload.array("image"),
    catchAsync(verifyImageContent),
    catchAsync(PG.uploadToCloudinary),
    validatePG,
    catchAsync(PG.createPg)
  );

router.get("/new", isLoggedIn, PG.renderNewForm);

router.get("/search", PG.searchPg);


router
  .route("/:id")
  .get(catchAsync(PG.showPg))
  // Update the edit route as well
  .put(
    isLoggedIn,
    isAuthor,
    tempUpload.array("image"),
    catchAsync(verifyImageContent),
    catchAsync(PG.uploadToCloudinary),
    validatePG,
    catchAsync(PG.updatePg)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(PG.deletePg));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(PG.renderEditForm));

module.exports = router;

const Pg = require('../models/pg');
const cloudinary = require("cloudinary").v2;
const { uploadOnCloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
const fs = require("fs");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

// Add a new method for Cloudinary upload after verification
module.exports.uploadToCloudinary = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "PGBuddy", allowed_formats: ["jpeg", "png", "jpg"] },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve({
              url: result.secure_url,
              filename: result.public_id,
            });
          }
        );

        fs.createReadStream(file.path).pipe(stream);
      });
    });

    const results = await Promise.all(uploadPromises);

    // Store uploaded files info in req for later use
    req.cloudinaryFiles = results;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports.index = async (req, res) => {
  const PG = await Pg.find({});
  res.render("PG/index", { PG });
};

module.exports.renderNewForm = (req, res) => {
  res.render("PG/new");
};

module.exports.createPg = async (req, res, next) => {
  try {
    // Get geocoding data
    const geoData = await maptilerClient.geocoding.forward(
      req.body.PG.location,
      {
        limit: 1,
      }
    );

    const pg = new Pg(req.body.PG); 

    // Check if geocoding results exist
    if (geoData.features && geoData.features.length > 0) {
      // Explicitly set the geometry type and coordinates
      pg.geometry = {
        type: "Point",
        coordinates: geoData.features[0].geometry.coordinates,
      };
    } else {
      // Fallback coordinates if geocoding fails (center of India)
      pg.geometry = {
        type: "Point",
        coordinates: [78.9629, 20.5937],
      };
    }

    // Use the files that passed verification and were uploaded to Cloudinary
    if (req.cloudinaryFiles && req.cloudinaryFiles.length > 0) {
      pg.images = req.cloudinaryFiles;
    }

    pg.author = req.user._id;
    await pg.save();
    console.log(pg);
    req.flash("success", "Successfully registered your PG!");
    res.redirect(`/PG/${pg._id}`);
  } catch (error) {
    console.error("Error creating PG:", error);
    req.flash("error", "Error creating PG: " + error.message);
    res.redirect("/PG/new");
  }
};

module.exports.showPg = async (req, res) => {
  const pg = await Pg.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!pg) {
    req.flash("error", "PG does not exist");
    return res.redirect("/PG");
  }
  res.render("PG/show", { pg });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const pg = await Pg.findById(id);
  if (!pg) {
    req.flash("error", "PG does not exist");
    return res.redirect("/PG");
  }
  res.render("PG/edit", { pg });
};

module.exports.updatePg = async (req, res) => {
  try {
    const { id } = req.params;
    const pg = await Pg.findByIdAndUpdate(
      id,
      { ...req.body.PG },
      { new: true }
    );

    // Get geocoding data
    const geoData = await maptilerClient.geocoding.forward(
      req.body.PG.location,
      {
        limit: 1,
      }
    );


    // Check if geocoding results exist
    if (geoData.features && geoData.features.length > 0) {
      // Explicitly set the geometry type and coordinates
      pg.geometry = {
        type: "Point",
        coordinates: geoData.features[0].geometry.coordinates,
      };
    }
    // Don't change geometry if geocoding fails during update

    // Use the files that passed verification and were uploaded to Cloudinary
    if (req.cloudinaryFiles && req.cloudinaryFiles.length > 0) {
      pg.images.push(...req.cloudinaryFiles);
    }

    await pg.save();

    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await pg.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Successfully updated your PG");
    res.redirect(`/PG/${pg._id}`);
  } catch (error) {
    console.error("Error updating PG:", error);
    req.flash("error", "Error updating PG: " + error.message);
    res.redirect(`/PG/${req.params.id}/edit`);
  }
};

module.exports.deletePg = async (req, res) => {
  const { id } = req.params;
  const pg = await Pg.findById(id);
  await Pg.findByIdAndDelete(id);
  req.flash("success", "Sucessfully deleted your PG");
  res.redirect("/PG");
};

module.exports.searchPg = async (req, res) => {
  const { query } = req.query; // Get the search query from the URL

  try {
    // Search PGs by title or location (case-insensitive)
    const pgResults = await Pg.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ],
    });

    res.render("PG/searchResults", { pgResults, query }); // Render results
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const cloudinary = require("cloudinary").v2;
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded Successfully, ", response.url);

    fs.unlinkSync(localFilePath);

    return {
    url: response.secure_url,   // this is tentative as it depends on response although it can be tested through postman
    filename: response.public_id
    };
  } catch (error) {
    fs.unlinkSync(localFilePath);  // remove the locally saved temporary file as the upload operation got failed!!
    throw error;
  }
};

export { uploadOnCloudinary }

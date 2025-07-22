const Pg = require('../models/pg');
const cloudinary = require("cloudinary").v2;
const { uploadOnCloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async(req, res) => {
    const PG = await Pg.find({});
    res.render('PG/index' , {PG});
}

module.exports.renderNewForm = (req, res) => {
    res.render('PG/new');
}

module.exports.createPg = async(req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.PG.location, { limit: 1 });
    const pg = new Pg(req.body.PG);
    pg.geometry = geoData.features[0].geometry;

    if(req.files && req.files?.length > 0){
        const uploadPromises = req.files.map(async (file) => {
            const result = await uploadOnCloudinary(file.path);
            return result;
        })
        const uploadedImages = await Promise.all(uploadPromises);
    
           pg.images = uploadedImages.map(img => ({
               url: img.secure_url,
               filename: img.public_id
           }));
    }
    
    pg.author = req.user._id;
    await pg.save();
    console.log(pg); 
    req.flash('success', 'Successfully registered your PG !');
    res.redirect(`/PG/${pg._id}`);
}

module.exports.showPg = async(req, res) => {
    const pg = await Pg.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' 
        }
    }).populate('author');
    if (!pg){
        req.flash('error', 'PG does not exist');
        return res.redirect('/PG')
    }
    res.render('PG/show', {pg});
}

module.exports.renderEditForm = async(req,res) => {
    const { id } = req.params;
    const pg = await Pg.findById(id);
    if (!pg){
        req.flash('error', 'PG does not exist');
        return res.redirect('/PG')
    }
    res.render('PG/edit', {pg});
}

module.exports.updatePg = async(req, res) => {
    const { id } = req.params;
    const pg = await Pg.findByIdAndUpdate(id, {...req.body.PG}, { new: true });

    const geoData = await maptilerClient.geocoding.forward(req.body.PG.location, { limit: 1 });
    pg.geometry = geoData.features[0].geometry;

const uploadPromises = req.files.map(async (file) => {
        const result = await uploadOnCloudinary(file.path)
        return result;
})

const uploadedImages = await Promise.all(uploadPromises)
pg.images.push(...uploadedImages.map(img => ({ url: img.secure_url, filename: img.public_id })));


    await pg.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await pg.updateOne({ $pull: { images: { filename : { $in: req.body.deleteImages }}}})
    }
    req.flash('success', 'Sucessfully updated your PG');
    res.redirect(`/PG/${pg._id}`);
}

module.exports.deletePg = async(req, res) => {
    const { id } = req.params;
    const pg = await Pg.findById(id);
    await Pg.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted your PG');
    res.redirect('/PG');
}

module.exports.searchPg = async (req, res) => {
    const { query } = req.query; // Get the search query from the URL

    try {
        // Search PGs by title or location (case-insensitive)
        const pgResults = await Pg.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ]
        });

        res.render('PG/searchResults', { pgResults, query }); // Render results
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
}
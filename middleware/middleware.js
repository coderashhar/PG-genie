const { pgSchema, reviewSchema  } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const Pg = require('../models/pg'); 
const Review = require('../models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
     	req.flash('error', 'You must be signed in first!');
    	return res.redirect('/login');
    }
    next();
}

module.exports.validatePG = (req, res, next) => {
    // converting checkbox value e.g. "on" to boolean
    const amenities = [
        'furniture',
        'attachedBath',
        'waterSupply',
        'geyser',
        'wifi',
        'backupPower',
        'cctv',
        'washingMachine',
        'petFriendly'
    ];
    amenities.forEach((amenity) => {
        req.body.PG[amenity] = req.body.PG[amenity] === 'on';  // 'on' means checked, set it to true
    });
    const {error} = pgSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const pg = await Pg.findById(id);
    if (!pg.author.equals(req.user._id)){
        req.flash('error', 'Only PG host can do that!');
        res.redirect(`/PG/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that!");
        res.redirect(`/PG/${id}`);
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}
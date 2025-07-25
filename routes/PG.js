const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const PG = require('../controllers/PG.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn, validatePG, isAuthor } = require('../middleware.js');

router.route('/')
    .get(catchAsync(PG.index))
    // .post(isLoggedIn, upload.array('image'), catchAsync(PG.createPg))
    .post(isLoggedIn, upload.array('image'), validatePG, catchAsync(PG.createPg))

router.get('/new', isLoggedIn, PG.renderNewForm)

//router.get('/search', PG.searchPg);

router.route('/:id')
    .get(catchAsync(PG.showPg))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePG, catchAsync(PG.updatePg))
    .delete(isLoggedIn, isAuthor, catchAsync(PG.deletePg))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(PG.renderEditForm))

module.exports = router;
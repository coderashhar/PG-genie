const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Show login form
router.get('/login', (req, res) => {
  res.render('user/login'); // create user/login.ejs
});

// Handle local login
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/user/login',
  })
);

// Show register form
router.get('/register', (req, res) => {
  res.render('user/register'); // create user/register.ejs
});

// Handle local registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      res.redirect('/profile');
    });
  } catch (e) {
    console.error(e);
    res.redirect('/user/register');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Profile (protected route)
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('user/profile', { user: req.user }); 
});

// Middleware to check login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/user/login');
}

module.exports = router;
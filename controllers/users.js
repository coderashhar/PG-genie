const User = require("../models/user");

module.exports.renderRegForm = (req, res) => {
  res.render("user/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Find My PG !");
      res.redirect("/PG");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back !");
  const redirectUrl = res.locals.returnTo || "/PG";
  res.redirect(redirectUrl);
};

module.exports.renderLogoutForm = (req, res) => {
  res.render("user/logout");
};

module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
};

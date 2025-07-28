const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/auth/google/callback`, // ✅ Fixed here
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          } else {
            user = await User.create(newUser);
            return done(null, user);
          }
        } catch (err) {
          console.error("Google Auth Error:", err);
          return done(err, null); // Ensure proper error handling
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => done(null, user));
  });
};
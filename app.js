// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

// Routes
const userRoutes = require("./routes/users.js");
const PGroutes = require("./routes/PG.js");
const reviewsRoutes = require("./routes/reviews.js");
const authRoutes = require("./routes/auth");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/pg-genie";

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error :("));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize({ replaceWith: "_" }));

// Session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
});
store.on("error", function (e) {
  console.log("Session Store Error", e);
});

// Session config
const sessionConfig = {
  store,
  name: "schemas",
  secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: true, // Enable if using HTTPS
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// Apply session and flash
app.use(session(sessionConfig));
app.use(flash());

// Helmet security setup
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];
const connectSrcUrls = ["https://api.maptiler.com/"];
const fontSrcUrls = [];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dqwsuokwl/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// Passport config (Google strategy)
require("./middleware/passport")(passport);

// Passport local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Locals middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/PG", PGroutes);
app.use("/PG/:id/reviews", reviewsRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Looks like something went wrong :/";
  res.status(statusCode).render("error", { err });
});

// Create temp directory
const fs = require("fs");
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Start server
app.listen(3000, () => {
  console.log("Listening on port 3000");
});

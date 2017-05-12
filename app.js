const express = require("express"),
			app = express(),
			bodyParser = require("body-parser"),
			mongoose = require("mongoose"),
			passport = require("passport"),
			LocalStrategy = require("passport-local"),
			staticAssets = __dirname + "/public",
			Campground = require("./models/campground"),
			Comment = require("./models/comment"),
			User = require("./models/user"),
			seedDB = require("./seeds")
// requiring routes
const campgroundRoutes = require("./routes/campgrounds"),
			commentsRoutes = require("./routes/comments"),
			indexRoutes = require("./routes/index")

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp");
// seedDB(); // seed the database

app
	// PASSPORT CONFIGURATION
	.use(require("express-session")({
		secret: "Jennifer wins cutest person!",
		resave: false,
		saveUninitialized: false
	}))
	.use(passport.initialize())
	.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app
	.use(bodyParser.urlencoded({extended: true}))
	.set("view engine", "ejs")
	.use(express.static(staticAssets))
	.use(function(req, res, next) {
		res.locals.currentUser = req.user;
		next();
	})
	// ROUTES
	.use("/", indexRoutes)
	.use("/campgrounds", campgroundRoutes)
	.use("/campgrounds/:id/comments", commentsRoutes)
	.listen(3000, function() {
		console.log("Listening on port 3000");
	})


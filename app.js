const express = require("express"),
			app = express(),
			bodyParser = require("body-parser"),
			mongoose = require("mongoose"),
			passport = require("passport"),
			LocalStrategy = require("passport-local"),
			methodOverride = require("method-override"),
			flash = require("connect-flash"),
			session = require("express-session"),
			MongoStore = require("connect-mongo")(session)
			staticAssets = __dirname + "/public",
			Campground = require("./models/campground"),
			Comment = require("./models/comment"),
			User = require("./models/user"),
			seedDB = require("./seeds"),
			// requiring routes
			campgroundRoutes = require("./routes/campgrounds"),
			commentsRoutes = require("./routes/comments"),
			indexRoutes = require("./routes/index")

app
	.use(flash())
	.use(session({
		secret: "Jennifer wins cutest person!",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({mongooseConnection: mongoose.connection}),
		cookie: {maxAge: 180 * 60 * 1000}
	}))

// PASSPORT CONFIGURATION
mongoose.Promise = global.Promise;
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);

// seedDB(); // <==== seeding the database
app
	.use(passport.initialize())
	.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app
  .set('port', (process.env.PORT || 3000))
	.use(bodyParser.urlencoded({extended: true}))
	.set("view engine", "ejs")
	.use(express.static(staticAssets))
	.use(methodOverride("_method"))
	.use(function(req, res, next) {
		res.locals.currentUser = req.user;
		res.locals.error = req.flash("error");
		res.locals.success = req.flash("success");
		next();
	})

// ROUTES
app
	.use("/", indexRoutes)
	.use("/campgrounds", campgroundRoutes)
	.use("/campgrounds/:id/comments", commentsRoutes)

app.listen(app.get("port"), function() {
		console.log("Listening...");
	})


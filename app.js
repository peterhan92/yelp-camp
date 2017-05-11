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

mongoose.connect("mongodb://localhost/yelp_camp");
seedDB();

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
	// ROUTES
	.get("/", function(req, res) {
		res.render("home");
	})
	.get("/campgrounds", function(req, res) {
		// Get all campgrounds from DB
		Campground.find({}, function(err, allCampgrounds) {
			if (err) {
				console.log(err);
			} else {
				res.render("campgrounds/index", {campgrounds: allCampgrounds});
			}
		})
	})
	.post("/campgrounds", function(req, res) {
		// get data from form and add to campgrounds array
		var name = req.body.name;
		var img = req.body.image;
		var desc = req.body.description;
		var newCampground = {name: name, img: img, description: desc }
		//Create a new campground and save to DB
		Campground.create(newCampground, function(err, newlyCreated) {
			if (err) {
				console.log(err);
			} else {
				// redirect to campgrounds page
				res.redirect("/campgrounds");				
			}
		})
	})
	.get("/campgrounds/new", function(req, res) {
		res.render("campgrounds/new.ejs")
	})
	.get("/campgrounds/:id", function(req, res) {
		// find the campgroud with the provided ID
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgound) {
			if (err) {
				console.log(err);
			} else {
				// render show template with that campground
				console.log(foundCampgound);
				res.render("campgrounds/show", {campground: foundCampgound});
			}
		})
	})
	// ===================
	// COMMENTS ROUTES
	// ===================
	.get("/campgrounds/:id/comments/new", function(req, res) {
		Campground.findById(req.params.id, function(err, campground) {
			if (err) {
				console.log(err);
			} else {
				res.render("comments/new", {campground: campground});
			}
		})
	})
	.post("/campgrounds/:id/comments", function(req, res) {
		// look up campground using id
		Campground.findById(req.params.id, function(err, campground) {
			if (err) {
				console.log(err);
				res.redirect("/campground")
			} else {
				Comment.create(req.body.comment, function(err, comment) {
					if (err) {
						console.log(err);
					} else {
						campground.comments.push(comment);
						campground.save();
						res.redirect("/campgrounds/" + campground._id);
					}
				})
			}
		})
	})
	// AUTH ROUTES
	//show register form
	.get("/register", function(req, res) {
		res.render("register");
	})
	.post("/register", function(req, res) {
		var newUser = new User({username: req.body.username});
		User.register(newUser, req.body.password, function(err, user) {
			if (err) {
				console.log(err);
				return res.render("register");
			}
			passport.authenticate("local")(req, res, function() {
				res.redirect("/campgrounds");
			})
		})
	})
	.listen(3000, function() {
		console.log("Listening on port 3000");
	})
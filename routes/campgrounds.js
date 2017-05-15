const express = require("express"),
		router = express.Router(),
		Campground = require("../models/campground")

router
	// INDEX
	.get("/", function(req, res) {
		// Get all campgrounds from DB
		Campground.find({}, function(err, allCampgrounds) {
			if (err) {
				console.log(err);
			} else {
				res.render("campgrounds/index", {campgrounds: allCampgrounds});
			}
		})
	})
	// CREATE
	.post("/", isLoggedIn ,function(req, res) {
		// get data from form and add to campgrounds array
		var name = req.body.name;
		var image = req.body.image;
		var desc = req.body.description;
		var author = {
			id: req.user._id,
			username: req.user.username
		}
		var newCampground = {name: name, image: image, description: desc, author:author}
		//Create a new campground and save to DB
		Campground.create(newCampground, function(err, newlyCreated) {
			if (err) {
				console.log(err);
			} else {
				// redirect to campgrounds page
				console.log(newlyCreated)
				res.redirect("/campgrounds");				
			}
		})
	})
	// NEW
	.get("/new", isLoggedIn,function(req, res) {
		res.render("campgrounds/new.ejs")
	})
	// SHOW
	.get("/:id", function(req, res) {
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
	// EDIT
	.get("/:id/edit", function(req, res) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				res.redirect("/campgrounds");
			} else {
				res.render("campgrounds/edit", {campground: foundCampground});
			}
		})
	})
	// UPDATE
	.put("/:id", function(req, res) {
		// find and update the correct campground
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
			if (err) {
				res.redirect("/campgrounds");
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
		})
	})
	// DESTROY 
	.delete("/:id", function(req, res) {
		Campground.findByIdAndRemove(req.params.id, function(err) {
			if (err) {
				res.redirect("/campgrounds");
			} else {
				res.redirect("/campgrounds");
			}
		})
	})
// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
} 

module.exports = router;
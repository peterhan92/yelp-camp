const express = require("express"),
		router = express.Router(),
		Campground = require("../models/campground"),
		middleware = require("../middleware")

router
	// INDEX
	.get("/", middleware.savePath, function(req, res) {
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
	.post("/", middleware.isLoggedIn ,function(req, res) {
		// get data from form and add to campgrounds array
		var name = req.body.name;
		var price = req.body.price;
		console.log(price);
		console.log(req.body.price)
		var image = req.body.image;
		var desc = req.body.description;
		var author = {
			id: req.user._id,
			username: req.user.username
		}
		var newCampground = {name: name, price: price, image: image, description: desc, author:author}
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
	.get("/new", middleware.isLoggedIn, function(req, res) {
		res.render("campgrounds/new.ejs")
	})
	// SHOW
	.get("/:id", middleware.savePath,function(req, res) {
		// find the campgroud with the provided ID
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
			if (err) {
				console.log(err);
			} else {
				// render show template with that campground
				res.render("campgrounds/show", {campground: foundCampground});
			}
		})
	})
	// EDIT
	.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
			Campground.findById(req.params.id, function(err, foundCampground) {
				res.render("campgrounds/edit", {campground: foundCampground});
			})
	})
	// UPDATE
	.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
		// find and update the correct campground
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
			if (err) {
				res.redirect("back");
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
		})
	})
	// DESTROY 
	.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
		Campground.findByIdAndRemove(req.params.id, function(err) {
			if (err) {
				req.flash("error", "You don't have permission to do that")
				res.redirect("back");
			} else {
				req.flash("succes", "Campground deleted");
				res.redirect("/campgrounds");
			}
		})
	})

module.exports = router;
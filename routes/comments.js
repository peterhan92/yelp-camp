const express = require("express"),
			router = express.Router({mergeParams: true}),
			Campground = require("../models/campground"),
			Comment = require("../models/comment")

router
	// Comments New
	.get("/new", isLoggedIn, function(req, res) {
		console.log(req.params.id);
		Campground.findById(req.params.id, function(err, campground) {
			if (err) {
				console.log(err);
			} else {
				res.render("comments/new", {campground: campground});
			}
		})
	})
	// Comments Create
	.post("/", isLoggedIn, function(req, res) {
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
						// add username and id to comments
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						// save comments
						comment.save()
						campground.comments.push(comment);
						campground.save();
						console.log(comment);
						res.redirect("/campgrounds/" + campground._id);
					}
				})
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
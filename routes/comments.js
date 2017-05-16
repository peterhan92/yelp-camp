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
	// Edit Comments
	.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		})
	})
	// UPDATE
	.put("/:comment_id", checkCommentOwnership, function(req, res) {
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
			if (err) {
				res.redirect("back");
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
		})
	})
	// DESTROY
	.delete("/:comment_id", checkCommentOwnership, function(req, res) {
		Comment.findByIdAndRemove(req.params.comment_id, function(err) {
			if (err) {
				res.redirect("back");
			} else {
				res.redirect("/campgrounds/" + req.params.id)
			}
		});
	})
// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
} 

function checkCommentOwnership(req, res, next) {
	// is user logged in?
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				// does user own the comment?
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		})
	} else {
		res.redirect("back");
	}
}

module.exports = router;
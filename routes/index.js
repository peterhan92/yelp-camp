const express = require("express"),
			router = express.Router(),
			passport = require("passport"),
			User = require("../models/user")

router
	// root route
	.get("/", function(req, res) {
		res.render("home");
	})
	//show register form
	.get("/register", function(req, res) {
		res.render("register");
	})
	// handle sign up logic
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
	// show login form
	.get("/login", function(req, res) {
		res.render("login");
	})
	// handling login logic
	.post("/login", passport.authenticate("local", {
		successRedirect: "/campgrounds", 
		failureRedirect: "/login"
	}) ,function(req, res) {
	})
	// logout
	.get("/logout", function(req, res) {
		req.logout();
		res.redirect("/campgrounds");
	})

// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
} 

module.exports = router
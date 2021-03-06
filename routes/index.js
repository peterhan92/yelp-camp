const express = require("express"),
			router = express.Router(),
			passport = require("passport"),
			User = require("../models/user")

router
	// root route
	.get("/", function(req, res) {
		res.render("landing");
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
				req.flash("error", err.message);
				return res.redirect("register");
			}
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Welcome to YelpCamp " + user.username);
				res.redirect("/campgrounds");
			})
		})
	})
	// show login form
	.get("/login", function(req, res) {
		res.render("login");
	})
	// handling login logic
	.post("/login", function(req, res, next) {
		passport.authenticate("local", function(err, user, info) {
			if (err) {
				return next(err);
			} else if(!user) {
				req.flash("error", "Username or password is incorrect. Please try again.");
				return res.redirect("/login");
			}
			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}
				var redirectTo = req.session.redirectTo ? req.session.redirectTo: "/campgrounds";
				delete req.session.redirectTo;
				req.flash("success", "Welcome back, " + user.username);
				res.redirect(redirectTo);
			})
		})(req, res, next);
	})
	// logout
	.get("/logout", function(req, res) {
		req.logout();
		req.flash("success", "Successfully Logged out");
		res.redirect("/campgrounds");
	})

module.exports = router
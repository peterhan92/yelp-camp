const express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose")

const staticAssets = __dirname + "/public";

mongoose.connect("mongodb://localhost/yelp_camp");
// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	img: String,
	description: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
// 	name: "Goat Mountain", 
// 	img: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg",
// 	description: "Lots of goats. Lots of goat milk and goat cheese for your consumption. Please be cautious of goat poo."
// }, function(err, campground) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log("NEWLY CREATED CAMPGROUND: ");
// 		console.log(campground);
// 	}
// })

app
	.use(bodyParser.urlencoded({extended: true}))
	.set("view engine", "ejs")
	.use(express.static(staticAssets))
	// routes
	.get("/", function(req, res) {
		res.render("home");
	})
	.get("/campgrounds", function(req, res) {
		// Get all campgrounds from DB
		Campground.find({}, function(err, allCampgrounds) {
			if (err) {
				console.log(err);
			} else {
				res.render("index", {campgrounds: allCampgrounds});
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
		res.render("new.ejs")
	})
	.get("/campgrounds/:id", function(req, res) {
		// find the campgroud with the provided ID
		Campground.findById(req.params.id, function(err, foundCampgound) {
			if (err) {
				console.log(err);
			} else {
				// render show template with that campground
				res.render("show", {campground: foundCampgound});
			}
		})
	})
	.listen(3000, function() {
		console.log("Listening on port 3000");
	})
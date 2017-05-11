const mongoose = require("mongoose"),
Campground = require("./models/campground"),
Comment = require("./models/comment")

var data = [
	{
		name: "Goat Mountain", 
		image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg",
		description: "Want some freshly squeezed goat milk? Camp here! At Goat Mountain. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Viridian Forest", 
		image: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg",
		description: "Catch caterpies, weedles and if you're lucky, maybe a pikachu ;) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Loconos", 
		image: "https://farm3.staticflickr.com/2353/2069978635_2eb8b33cd4.jpg",
		description: "Almost as nice as Poconos. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
]

function seedDB() {
	// Remove all campgrounds
	Campground.remove({}, function(err) {
		if (err) {
			console.log(err);
		}
		console.log("removed campgrounds!");
		// add a few campgrounds
		data.forEach(function(seed) {
			Campground.create(seed, function(err, campground) {
				if (err) {
					console.log(err);
				} else {
					console.log("added Campgrounds");
					// create a comment
					Comment.create(
						{
							text: "This place is amazing!! Needs wifi though.",
							author: "Homer"
						}, function(err, comment) {
							if (err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment")
							}
						})
				}
			})
		})
	})
}

module.exports = seedDB;
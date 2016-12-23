var bf = require('./basefunctions.js');


// --- PSEUDOCODE

// current = initial state
// for t = 1 to infinity:
// 	t = schedule[t]
// 	if t = 0
// 		then return current
// 	else
// 		choose successos of current at random
// 		delta e = f(successor) - f(current)
// 		if delta e >= 0
// 			then current = successor
// 		else
// 			current = successor with probability e^(delta e/t)

module.exports.annealing = function(map, letter) {

	var properties = {
		"map": map,
		"T": 2000
	}
	var supreme = bf.loadPosition(letter, properties.map);
	console.log(supreme);
	console.log("initialising annealing.");

	var currentpath = {
		"toursize": 0,
		"tour": []
	}
	currentpath.tour = bf.generateRandom(properties.map.size);
	currentpath.toursize = bf.crawl(currentpath.tour, properties.map);

	var step = 0;
	while (properties.T > 0){
		step++;
		// properties.T = 0;
		// T decrements by 1/log of curent step number
		properties.T = 1/Math.log(step)

		var adjacentpath = {
			"toursize": 0,
			"tour": []
		}

		bf.mutate(currentpath.tour, "random", function(err, tour){
			adjacentpath.tour = tour;
			// console.log(adjacentpath.tour);
			adjacentpath.toursize = bf.crawl(tour, properties.map);
		});

		if (currentpath.toursize > adjacentpath.toursize){
			currentpath = adjacentpath
			// console.log(properties.T + " - " + currentpath.toursize)
		}
		else {
			var random = Math.random();
			var probability = Math.exp((adjacentpath.toursize - currentpath.toursize)/properties.T)
			// replace with probability e^(lo - l1 / T)
			if (random > probability){
				currentpath = adjacentpath
				// console.log(properties.T + " - " + currentpath.toursize)
			}
		}
		// console.log(currentpath.toursize)

		// check for master human.
		if (currentpath.toursize < supreme.tourlength) {
			supreme.tour = currentpath.tour;
			supreme.tourlength = currentpath.toursize;
			console.log("New Supreme: " + supreme.tourlength + " - " + supreme.tour);
			bf.savePosition(supreme,letter);
		}
	}

}
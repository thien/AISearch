// partially mapped crossover, goldberg & lingle (1985)
module.exports.pmx = function(p1, p2, done) { // parent tours
		// var p1 = [1,2,3,4,5,6,7,8];
		// var p2 = [3,7,5,1,6,8,2,4];

		// generate cut points
		// cut1 = 3
		// cut2 = 6
		cut1 = randomInt(0, Math.floor(p1.length));
		cut2 = randomInt(cut1, p1.length);

		// calculate difference
		diff = cut2 - cut1
			// console.log("len " + p1.length);
			// console.log("cut1 "+cut1)
			// console.log("cut1 "+cut2)
			// console.log("diff" + diff)

		// initialise offspring with null values
		var o1 = fillArray(cut1, -1);
		var o2 = fillArray(cut1, -1);

		// substrings within the cut points
		var m1 = p2.slice(cut1, cut2);
		var m2 = p1.slice(cut1, cut2);

		// merges initially empty lhs with cutpoints; rhs will be appended at the end of the list
		o1 = o1.concat(m1);
		o2 = o2.concat(m2);

		// initialise rhs list
		var r1 = [];
		var r2 = [];

		// this loop will generate the lhs before cutpoint
		for (var i = 0; i < cut1; i++) {
			// generate offspring
			o1[i] = recurseMappings(p1[i], o1, p1);
			o2[i] = recurseMappings(p2[i], o2, p2);
			// generate lhs of offspring
		}

		// this loop will generate the rhs after cutpoint
		for (var i = cut2; i < p1.length; i++) {
			// generate rhs of offspring
			var city1 = recurseMappings(p1[i], o1, p1);
			var city2 = recurseMappings(p2[i], o2, p2);
			o1.push(city1);
			o2.push(city2);
		}

		return done(null, [o1, o2]);

		function recurseMappings(city, used, tour) {
			// checks whether a city exists inside list
			// returns a city that's resulted from a list traversal through the mappings (if the initial city exists)
			// otherwises returns the city

			if (used.indexOf(city) > -1) {
				// get position.
				pos = used.indexOf(city);
				// recurse with the tour position
				return recurseMappings(tour[pos], used, tour);
			} else {
				// city is not in the used array.
				return city;
			}
		}

		function fillArray(n, value) {
			// fills an array.
			return Array.apply(null, Array(n)).map(Number.prototype.valueOf, value);
		}

		function randomInt(low, high) {
			return Math.floor((Math.random() * (high - low)) + low)
		}

		function hasDuplicates(array) {
			return (new Set(array)).size !== array.length;
		}
	}
	// console.log("parent1 " + p1);
	// console.log("parent2 " + p2);
	// console.log("cut1 " + m1);
	// console.log("cut2 " + m2);
	// console.log(o1 + " " + hasDuplicates(o1));
	// console.log(o2 + " " + hasDuplicates(o2));
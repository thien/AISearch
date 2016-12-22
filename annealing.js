var bf = require('./basefunctions.js');

module.exports.annealing = function(map) {

	// function anneal(map) {
	var properties = {
		"map": map,
		"T": 10000,
		"T_min": 0.00001,
		"alpha": 0.9,
		"rounds": 100
	}
	console.log("initialising annealing.");
	properties.bigboy = generateRandom();
	properties.length = crawl(properties.bigboy, properties.map);
	// console.log(properties.bigboy);
	// console.log(properties.length);
	console.log("running annealing");
	while (T > T_min) {
		for (var i = 0; i < rounds; i++) {
			var random = generateRandom(properties.map.size);
			var new_sol = mutate(random)
				// console.log(new_sol.length)
			var new_cost = crawl(new_sol)
			var ap = acceptance_probability(properties.length, new_cost, T)
			if (ap > Math.random()) {
				properties.bigboy = new_sol;
				properties.length = new_cost;
				// console.log(properties.length);
			}
		}
		T = T * alpha
	}
	// console.log("Best toursize: " + properties.length + " - " + properties.bigboy);
	for (var i = 0; i < properties.bigboy.length; i++) {
		properties.bigboy[i] += 1;
	}
	// properties.map.writeFile(1, properties.length, properties.bigboy);
	// console.log(properties.bigboy);

// -----------------------------

	function acceptance_probability(old, ne, T) {
		var a = 0;
		if (ne < old) {
			a = 1;
		} else {
			if (old / 2 > ne) {
				a = 0.5;
			}
			if (old / 3 > ne) {
				a = 0.3;
			}
			if (old / 4 > ne) {
				a = 0;
			}
		}
		return a;
	}

	function mutate(k) {
		var size = k.length - 1;
		// console.log(size);
		var a = Math.round((Math.random() * size) - 1)
		var b = Math.round((Math.random() * size) - 1)
		var temp = k[b];
		k[b] = k[a];
		k[b] = temp;
		return k;
	}

	function crawl(list) {
		// console.log("running crawl");
		var size = 0;
		var start_city = list[0];
		var current_pos = list[0];

		for (var i = 0; i < list.length - 1; i++) {
			var next_pos = list[i + 1]
			size += parseFloat(properties.map.matrix[current_pos][next_pos]);
			current_pos = next_pos;
		}
		size += parseFloat(properties.map.matrix[current_pos][start_city]);
		return size;
	}

	function shuffle(array) {
		// Durstenfeld shuffle algorithm; shuffles arrays in place.
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	function generateRandom(size) {
		var array = []
		for (var i = 0; i < size; i++) {
			array.push(i);
		}
		array = shuffle(array);
		return array;
	}
}
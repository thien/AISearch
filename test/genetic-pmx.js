var bf = require('../basefunctions.js');
var pmx = require('../pmx.js');

// genetic algorithm
module.exports.genetic = function(map, letter) {
	var savelocation = letter;
	var properties = {
		"map": map,
		"mutation_rate": 0.3,
		"population_size": 10000,
		"population": [], // randomly generated initial population
		"generations": 100000
	}

	console.log("running Genetic Algorithm");
	generatePopulation(properties);
	lapGenerations(properties, letter);

	function generatePopulation(properties) {
		// generates the population
		for (var i = 0; i < properties.population_size; i++) {
			var tour = bf.generateRandom(properties.map.size);
			var length = bf.crawl(tour, properties.map);
			var crawler = {
				"tour": tour,
				"size": length
			}
			properties.population.push(crawler);
		}
	}

	function lapGenerations(properties, letter) {

		// initiate the supreme tour
		var supreme = bf.loadPosition(letter, properties.map);

		// initialise local supreme
		var fittest_individual = {
			"tour": [],
			"size": Number.MAX_VALUE
		};

		// initialise extra variables
		var runstart = new Date();


		// iterate through the generations
		for (var i = 0; i < properties.generations; i++) {
			var timestart = new Date();
			var next_population = [];
			var pop_size = properties.population_size;
			while (pop_size > 0) {
				pop_size -= 2;
				generateParents(properties, letter, function(x, y) {
					generateOffspring(x, y, function(a, b) {
						// go through mutation roulette
						var z;
						bf.mutate(a.tour, properties.mutation_rate, "random", function(err, tour) {
							a.tour = tour;
							a.size = bf.crawl(a.tour, properties.map);
						});
						bf.mutate(b.tour, properties.mutation_rate, "random", function(err, tour) {
							b.tour = tour;
							b.size = bf.crawl(b.tour, properties.map);
						});
						if (a.size > b.size) {
							z = b;
						} else {
							z = a;
						}

						next_population.push(a);
						next_population.push(b);

						// check if child is greater than master human.
						if (z.size < fittest_individual.size) {
							console.log("new local_fit " + z.size + " @ gen " + i)
							fittest_individual = z;
						}
						if (z.size < supreme.tourlength) {
							supreme.tour = z.tour;
							supreme.tourlength = z.size;
							console.log("Generation: " + i + " New Supreme: " + supreme.tourlength + " - " + supreme.tour);
							bf.savePosition(supreme, letter);
							// properties.map.writeFile(0, supreme.size, supreme.tour);
							// console.log("ww");
						}
					});
				});
			}

			// start by sorting the population based on their pedigree (which will be the tour size)
			// bf.sortByPedigree(next_population);
			// for (k in next_population){
			// 	console.log(next_population[k].size);
			// }

			properties.population = next_population;
			var time_per_generation = (Math.abs(new Date() - timestart)) / 1000 + " seconds";
			console.log("PMX - (" + fittest_individual.size + ") G. " + i + " - " + time_per_generation)
		}

		for (var i = 0; i < supreme.tour.length; i++) {
			supreme.tour[i] += 1;
		}
		console.log("MASTER: " + supreme.tourlength + " " + supreme.tour);
		console.log("22");
		bf.savePosition(supreme, letter);
		// properties.map.writeFile(0, supreme.size, supreme.tour);
	}

	function generateParents(properties, letter, done) {
		// get two random positions
		var rand1 = Math.ceil(Math.random() * properties.population_size) - 1;
		var rand2 = Math.ceil(Math.random() * properties.population_size) - 1;
		// use random numbers to get parents

		var x = properties.population[rand1];
		var y = properties.population[rand2];

		// send parents off to generate children
		done(x, y);
	}

	function generateOffspring(x, y, done) {
		// generate offspring using pmx function
		var offsprings = pmx.pmx(x.tour, y.tour, function(err, babies) {
			var child1 = {
				"tour": babies[0],
				"size": Number.MAX_VALUE
			}
			child1.size = bf.crawl(child1.tour, properties.map);
			var child2 = {
				"tour": babies[1],
				"size": Number.MAX_VALUE
			}
			done(child1, child2);
		});
		// done(child1, child2);
	}

	function crossover(x, y) {
		var out = {
				"tour": [],
				"size": 0
			}
			// var out = new Human([],0)
		var n = x.tour.length - 1;
		var half = Math.ceil(x.tour.length / 2);

		//onecheck
		var a = [...x.tour.slice(0, half)];
		var b = [...y.tour.slice(half, n)];
		a.push.apply(a, b);
		// console.log("a: " + a);
		a = bf.removeDuplicates(a);
		a = bf.checkmissing(a, properties.map);
		a = mutate(a);
		// console.log("a: " + a);
		var arange = bf.crawl(a, properties.map);

		//twocheck
		var c = [...y.tour.slice(0, half)];
		var d = [...x.tour.slice(half, n)];
		c.push.apply(c, d);
		// console.log("len" + c.length+d.length)
		// console.log("c: "+c);
		c = bf.removeDuplicates(c);
		c = bf.checkmissing(c, properties.map);
		c = mutate(c);
		// console.log("c: " + c);
		var crange = bf.crawl(c, properties.map);

		if (arange > crange) {
			// console.log("lol")
			out.tour = Array.from(c);
			out.size = crange;
		} else {
			// console.log("win")
			out.tour = Array.from(a);
			out.size = arange;
		}
		return out;
	}

	function mutate(k, rate) {
		// check if mutation is greater
		if (Math.random() > rate) {
			var size = k.length - 2;
			var mutation = k.concat();
			// swap with random positions
			// var x = Math.round((Math.random() * size) - 1)
			// var y = Math.round((Math.random() * size) - 1)

			// swap with neighbouring positions
			var x = Math.round((Math.random() * size));
			var y = x + 1;

			// swap positions
			var b = mutation[y];
			mutation[y] = mutation[x];
			mutation[x] = b;

			// console.log(mutation);
			// console.log("mutation done")
		}
		return k;
		// console.log(k);
	}
}
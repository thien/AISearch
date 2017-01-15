var bf = require('./basefunctions.js');
var bfs = require('./bfs.js');

// genetic algorithm
module.exports.genetic = function(map, letter) {
	var savelocation = letter;
	var properties = {
		"map": map,
		"mutation_rate": 0.2,
		"population_size": 1000,
		"population": [], // randomly generated initial population
		"generations": 100000
	}

	console.log("running Genetic Algorithm");
	generatePopulation(properties);
	lapGenerations(properties, letter);

	function generatePopulation(properties) {
		// generates the population
		for (var i = 0; i < properties.population_size; i++) {
			// var tour = bf.generateRandom(properties.map.size);
			var tour = bfs.bfs(map.size, map.matrix, Math.round(Math.random() * map.size - 1)+1);
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
		// var supreme = {
		// 	"tourtitle": "tour" + properties.map.title,
		// 	"toursize": properties.map.size,
		// 	"tourlength": Number.MAX_VALUE,
		// 	"tour": []
		// }
		var supreme = bf.loadPosition(letter, properties.map);
		var fittest_individual = {
			"tour": [],
			"size": Number.MAX_VALUE
		};
		console.log(supreme);
		// iterate through the generations
		for (var i = 0; i < properties.generations; i++) {
			var timestart = new Date();
			var next_population = [];
			for (var j in properties.population) {
				var rand1 = Math.ceil(Math.random() * properties.population_size) - 1;
				var rand2 = Math.ceil(Math.random() * properties.population_size) - 1;

				var x = properties.population[rand1];
				var y = properties.population[rand2];

				// make new human.
				var z = crossover(x, y);

				next_population.push(z);

				// check for master human.
				if (z.size < fittest_individual.size) {
					fittest_individual = z
					console.log("Generation: " + i + " New fittest: " + fittest_individual.tour + " - " + fittest_individual.size);
					// bf.savePosition(supreme,letter);
					// properties.map.writeFile(0, supreme.size, supreme.tour);
					// console.log("ww");
				} else {
					// console.log(supreme.tourlength + "<" +  z.size)
				}
				if (z.size < supreme.tourlength) {
					supreme.tour = z.tour;
					supreme.tourlength = z.size;
					console.log("Generation: " + i + " New Supreme: " + supreme.tourlength + " - " + supreme.tour);
					bf.savePosition(supreme, letter);
					// properties.map.writeFile(0, supreme.size, supreme.tour);
					// console.log("ww");
				} else {
					// console.log(supreme.tourlength + "<" +  z.size)
				}
			}
			// will need to sort the array based on how good the population is.
			next_population.sort();

			properties.population = next_population;
			var time_per_generation = (Math.abs(new Date() - timestart)) / 1000 + " seconds";
			console.log("BASE - (" + fittest_individual.size + ") G. " + i + " - " + time_per_generation)
		}

		for (var i = 0; i < supreme.tour.length; i++) {
			supreme.tour[i] += 1;
		}
		console.log("MASTER: " + supreme.tourlength + " " + supreme.tour);
		console.log("22");
		bf.savePosition(supreme, letter);
		// properties.map.writeFile(0, supreme.size, supreme.tour);
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


        // bf.mutate_ps(a,properties.mutation_rate,function(err,tour){
        // 	a = tour;
        // });
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


		// bf.mutate_ps(c,properties.mutation_rate,function(err,tour){
  //       	c = tour;
  //       });
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

	function mutate(k) {
		// console.log("mutation ensuring")
		// console.log(k);
		// console.log(k);
		var size = k.length - 2;
		// console.log(size);
		var mutation = k.concat();
		// console.log(size);

		// swap with random positions
		// var x = Math.round((Math.random() * size) + 1)
		// var y = Math.round((Math.random() * size) + 1)

		// swap with neighbouring positions
		var x = Math.round((Math.random() * size));
		var y = x + 1;

		// swap positions
		var b = mutation[y];
		mutation[y] = mutation[x];
		mutation[x] = b;

		// console.log(mutation);
		// console.log("mutation done")
		return mutation;
		// console.log(k);
	}
}
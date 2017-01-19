var bf = require('../basefunctions.js');
var pmx = require('../pmx.js');
var bfs = require('../bfs.js');

// genetic algorithm
module.exports.genetic = function(map, letter) {
    var savelocation = letter;
    var properties = {
        "map": map,
        "mutation_rate": 0.5,
        "population_size": 535,
        "population": [], // randomly generated initial population
        "generations": 10000
    }

    console.log("running Genetic Algorithm");
    generatePopulation(properties);
    lapGenerations(properties, letter);

    function generatePopulation(properties) {
        // generates the population
        for (var i = 0; i < properties.population_size; i++) {
            // var tour = bf.generateRandom(properties.map.size);
            // console.log("or am i")
            var tour = bfs.bfs(map.size, map.matrix, Math.round(Math.random() * map.size));
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
                        // bf.mutate_ps(a.tour,properties.mutation_rate,function(err,tour){
                        // 	a.tour = tour;
                        //     a.size = bf.crawl(a.tour, properties.map)
                        // });
                        // bf.mutate_ps(b.tour,properties.mutation_rate,function(err,tour){
                        // 	b.tour = tour;
                        //     b.size = bf.crawl(b.tour, properties.map)
                        // });


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
}
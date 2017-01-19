var fs 		= require('fs');
var exec 	= require('child_process').exec;
var sys 	= require('util');

// require base functions
var tf 		= require('./tourfile.js');

// require methods.
var genetic = require('./genetic.js');
var anneal 	= require('./annealing.js');
var brute 	= require('./brute.js');
var genpmx 	= require('./test/genetic-pmx.js');
var bfs 	= require('./bfs.js');

tf.LoadTourFile("cityfiles/AISearchfile012.txt", function(err, map1) {
    genetic.genetic(map1, "B");
    anneal.annealing(map1, "A");
    tf.LoadTourFile("cityfiles/AISearchfile017.txt", function(err, map2) {
        genetic.genetic(map2, "B");
        anneal.annealing(map2, "A");
        tf.LoadTourFile("cityfiles/AISearchfile021.txt", function(err, map3) {
            genetic.genetic(map3, "B");
            anneal.annealing(map3, "A");
            tf.LoadTourFile("cityfiles/AISearchfile026.txt", function(err, map4) {
                genetic.genetic(map4, "B");
                anneal.annealing(map4, "A");
                tf.LoadTourFile("cityfiles/AISearchfile042.txt", function(err, map5) {
                    genetic.genetic(map5, "B");
                    anneal.annealing(map5, "A");
                    tf.LoadTourFile("cityfiles/AISearchfile048.txt", function(err, map6) {
                        genetic.genetic(map6, "B");
                        anneal.annealing(map6, "A");
                        tf.LoadTourFile("cityfiles/AISearchfile058.txt", function(err, map7) {
                            genetic.genetic(map7, "B");
                            anneal.annealing(map7, "A");
                            tf.LoadTourFile("cityfiles/AISearchfile175.txt", function(err, map8) {
                                genetic.genetic(map8, "B");
                                anneal.annealing(map8, "A");
                                tf.LoadTourFile("cityfiles/AISearchfile180.txt", function(err, map9) {
                                    genetic.genetic(map9, "B");
                                    anneal.annealing(map9, "A");
                                    tf.LoadTourFile("cityfiles/AISearchfile535.txt", function(err, map0) {
                                        genetic.genetic(map0, "B");
                                        anneal.annealing(map0, "A");
                                        tf.ConvertResultsIntoTxt();
                                        tf.checkResults();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});



// cd /Volumes/Soodibus/Github/AISearch/ && node new_index.js
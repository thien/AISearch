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


tf.LoadTourFile("cityfiles/AISearchfile012.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile017.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile021.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile026.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile042.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile048.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile058.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile175.txt", function(err, map) {
// tf.LoadTourFile("cityfiles/AISearchfile180.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile535.txt", function(err, map) {
	// console.log(map);
	// console.log(map.title);
	// console.log(map.size);
	genetic.genetic(map, "B");
	anneal.annealing(map, "A");
	// k = bfs.bfs(map.size, map.matrix, 0);
	// var length = bf.crawl(k, map);
	// console.log(length)
	// genpmx.genetic(map, "B");
	// tf.ConvertResultsIntoTxt();
	// tf.checkResults();
});

// cd /Volumes/Soodibus/Github/AISearch/ && node new_index.js
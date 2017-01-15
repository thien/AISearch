var fs = require('fs');
var genetic = require('./genetic.js');
var anneal = require('./annealing.js');
var brute = require('./brute.js');
var genpmx = require('./test/genetic-pmx.js');
var bfs = require('./bfs.js');


// LoadTourFile("cityfiles/AISearchfile012.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile017.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile021.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile026.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile042.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile048.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile058.txt", function(err, map) {
LoadTourFile("cityfiles/AISearchfile175.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile180.txt", function(err, map) {
// LoadTourFile("cityfiles/AISearchfile535.txt", function(err, map) {
	// console.log(map);
	console.log(map.title);
	console.log(map.size);
	genetic.genetic(map, "B");
	// bfs.bfs(map.size, map.matrix, Math.round(Math.random() * map.size));
	// genpmx.genetic(map, "B");
	// anneal.annealing(map, "A");
});

// cd /Volumes/Soodibus/Github/AISearch/ && node new_index.js

function LoadTourFile(filename, done) {
	var map = {
		"title": "",
		"location": filename,
		"size": 0,
		"matrix": [],
		"currentBestA": 901239123091209390123,
		"currentBestB": 901239123091209390123,
		"rawdata": "",
		"rawpos": ""
	}
	readItem(map);

	function readItem(map) {
		var content;
		// First I want to read the file
		console.log("Reading File");
		fs.readFile(map.location, "utf-8", function read(err, data) {
			if (err) {
				throw err;
			}
			// file location exists
			console.log("file read");
			map.rawdata = data;
			// console.log(data);
			processFile(map); // Or put the next step in a function and invoke it
		});
	}

	function processFile(map) {
		// remove spaces and such
		var data = map.rawdata.replace(/(\r\n|\n|\r)/gm, "");
		// splits data by comma.
		data = map.rawdata.split(",");

		// get title
		map.title = data.shift();
		map.title = map.title.split("=")[1].replace(/\s/g, '');

		// need to check whether we have a file for this already
		try {
			fs.accessSync('data/' + map.title + '.json');
			fs.readFile( 'data/' + map.title + '.json', function read(err, data) {
			    if (err) {
			    } else {
			    	// content = data;
			    	console.log('data/' + map.title + '.json' + " exists");
			    	done(null, JSON.parse(data));
				    // Invoke the next step here however you like
			    }
			});
		} catch (e) {
			console.log(map.title + " doesn't exist in datasets, will make one.");

	        // get size
			map.size = data.shift().replace(/[^0-9\-]/g, '');

			// sanitise tourdata;
			for (var i = 0; i < data.length; i++) {
				data[i] = data[i].replace(/[^0-9\-]/g, '');
			}

			// generate Matrix
			for (var i = 0; i < map.size; i++) {
				// old school array declaration
				// information.matrix[i] = new Array(information.size);
				map.matrix[i] = [];
			}
			for (var i = 0; i < map.matrix.length; i++) {
				for (var j = 0; j < map.matrix.length; j++) {
					map.matrix[j][i] = -1;
				}
			}

			map.rawpos = data;
			// console.log()
			console.log("filling matrix")
			fillMatrix(map);
		}

	}

	function fillMatrix(map) {
		var data = map.rawpos;
		// console.log(map.matrix);
		var k = 0;
		//plot data into matrix, runs in o(n) time.
		for (var i = 0; i < map.matrix.length; i++) {
			for (var j = 0; j < map.matrix.length; j++) {
				if (map.matrix[j][i] == -1) {
					if (i == j) {
						// distance between a city to itself is 0.
						map.matrix[j][i] = 0
					} else {
						// poll data from one location to another
						map.matrix[j][i] = data.shift();
						// transpose.
						map.matrix[i][j] = map.matrix[j][i];
					}
				}
			}
			var v = (i / map.matrix.length * 100).toFixed(0);
			if (v > k) {
				console.log("loading matrix: " + v + "%");
			}
			k = v;
		}
		// console.log(map.matrix);
		ManageNewMap(map);
	}

	function ManageNewMap(map) {
		map.rawdata = "";
		map.rawpos = "";
		map.filelocation = 'data/' + map.title + '.json';
		// const filelocation = 'data/' + map.title + '.json';

		fs.writeFileSync(map.filelocation, JSON.stringify(map));
		done(null, map);
	}}

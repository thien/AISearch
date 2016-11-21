"use strict";
var fs = require('fs');
var brute = require('./brute.js');
// var genetic = require('./genetic.js');
var check = require('./check.js');
var load = require('./loadfiles.js');
var fileExists = require('file-exists');

class TourFile{
	constructor(location){
		this.tour = {
			"title" 	: "",
			"location"	: location,
			"size"		: 0,
			"matrix"	: [],
			"BestA"		: 901239123091209390123,
			"BestB"		: 901239123091209390123
		}
		this.readItem();
	}
	saveMap(){
		var string = JSON.stringify(this.tour);
		var location = "maps/"+  this.tour.title + ".json";
		fs.writeFile(location, string, function (err) {
			//check for errors
			if (err) return console.log(err);
			//else continue.
			console.log('writing to ' + location);
		});
	}
	loadMap(mapname){
		var callback = function (err, data) {
			if (err) {
				console.log("something bad happened in the callback");
				return false;
			}
	        //sanitise data
			console.log("Map was preconfigured :)");
	        this.tour = JSON.parse(data);
			this.initialise();
			return true;
	    };
		if (fileExists("maps/"+  mapname + ".json")){
			console.log("map has been found on a json file.");
			return fs.readFile("maps/"+  mapname + ".json", "utf-8", callback);
		} else {
			return false;
		}
	}
	initialise(){
		// this.runGoods(this.myCallback);
		var results = load.loadGoods('cmkv68', this.tour.title, this.tour.currentBestA, this.tour.currentBestB);
		this.tour.currentBestA = results.bestA;
		this.tour.currentBestB = results.bestB;
		this.runChecks(this.review);
		// // console.log(this.tour.currentBestA);
		// // console.log(this.tour.currentBestB);
		console.log(this.tour.matrix);
		// console.log(this.tour.size);
		var l = new Annealing(this);
		// var k = new Genetic(this);

		//runs the python checking file.
		// check.runCheck();
	}
	initialiseSize(string_line){
		var line = ""
		for (var i = 0; i < len(string_line); i++){
			if (string_line[i] != ","){
				if (is_number(string_line[i]) == TRUE){
					line += string_line[i];
				}
			} else {
				break;
			}
		}
		line = int(line);

		this.tour.size = line;
		this.tour.matrix = new Array(line).fill(-1);
	}
	// myCallback(err, data) {
	//   if (err) throw err; // Check for the error and throw if it exists.
	//   console.log('got data: '+data); // Otherwise proceed as usual.
	// };
	// runGoods(callback){
	// 	callback(null, 'get it?');
	// }
	// // this.runGoods(this.myCallback);

	review(err,data){
		if (err) throw err; // Check for the error and throw if it exists.
  	  	console.log('got data: '+data); // Otherwise proceed as usual.
		this.tour.currentBestA = data.bestA;
		this.tour.currentBestB = data.bestB;
		console.log(data.bestA);
		console.log(data.bestB);
		// var l = new Annealing(this);
		// var k = new Genetic(this);
	}
	runChecks(callback){
		// run loadGoods and send it to callback.
		this.review(null, load.loadGoods('cmkv68', this.tour.title, this.tour.currentBestA, this.tour.currentBestB));
	}
	// this.runChecks(this.review);

	readItem(){
		console.log("Reading File...");
		var contents = fs.readFileSync(this.tour.location, 'utf8');
		// How you'd find a line break varies between operating system encodings. Windows would be \r\n but Linux just uses \n and Apple uses \r.
		console.log("File read");
		//sanitise enters.
		contents = contents.replace(/(\r\n|\n|\r)/gm,"");

		// splits data by comma.
		contents = contents.split(",");

		// extract name (first item in array)
		this.tour.title = contents.shift().split("=")[1].replace(/\s/g, '');

		//check if this title is in the maps folder.
		console.log("finding " + this.tour.title);

		var dir = "maps/" + this.tour.title + ".json";

		fs.readFile(dir, 'utf8', (err, data) => {
			if (err) {
			   console.error('There was an error reading the file!', err);
			   this.genFileGoods(contents);
			}
			console.log("map is loaded from a save");
			console.log(data);
			this.tour = JSON.parse(data);
			this.initialise();
		});


		fs.open('myfile', 'r', (err, fd) => {
		  if (err) {
		    if (err.code === "ENOENT") {
		      console.error('myfile does not exist');
		    //   return;
		    } else {
		    //   throw err;
		    }
			this.genFileGoods(contents);
		  }

		  readMyData(fd);
		});
	}

	genFileGoods(data){
		data = data.toString("utf8", 0, data.length);
		console.log("no map data recorded");
		console.log("Map " + this.tour.title + " is initialising");
		// extract size (first item in array)
		this.tour.size = data.shift().replace(/[^0-9\-]/g,'');

		// sanitise tour data.
		for (var i = 0; i < data.length; i++){
			data[i] = data[i].replace(/[^0-9\-]/g,'');
		}

		//fill matrix with goods.
		this.generateMatrix(data);

		//save the map into a JSON so you don't have to parse it again.
		this.saveMap();

		// run initialiser
		this.initialise();
	}

	generateMatrix(data){
		console.log("Generating Matrix...");

		for (var i = 0; i < this.tour.size; i++){
			this.tour.matrix[i] = new Array(this.tour.size);
		}
		for (var i = 0; i < this.tour.matrix.length; i++){
			for (var j = 0; j < this.tour.matrix.length; j++){
				this.tour.matrix[j][i] = -1;
			}
		}

		console.log("Filling Matrix...");
		var k = 0;
		//plot data into matrix, runs in o(n) time.
		for (var i = 0; i < this.tour.matrix.length; i++){
			for (var j = 0; j < this.tour.matrix.length; j++){
				if (this.tour.matrix[j][i] == -1){
					if (i == j){
						// distance between a city to itself is 0.
						this.tour.matrix[j][i] = 0
					}
					else {
						// poll data from one location to another
						this.tour.matrix[j][i] = data.shift();
						// transpose.
						this.tour.matrix[i][j] = this.tour.matrix[j][i];
					}
				}
			}
			var v = (i/this.tour.matrix.length * 100).toFixed(0);
			if (v > k){
				console.log("loading matrix: " + v + "%");
			}
			k = v;
		}
		console.log(this.tour.size + " items are initialised in the matrix.");
	}
	// sanitiseTours(data){
	// 	for (var i = 0; i < data.length; i++){
	// 		data[i] = data[i].replace(/[^0-9\-]/g,'');
	// 	}
	// }
	crawl(list){
		var size = 0;
		var start_city = list[0];
		var current_pos = list[0];
		for (var i = 0; i < list.length -1; i++){
			var next_pos = list[i+1]
			size += parseFloat(this.tour.matrix[current_pos,next_pos]);
			current_pos = next_pos;
		}
		size += parseFloat(this.tour.matrix[current_pos,start_city]);
		return size;
	}
	shuffle(array){
		// Durstenfeld shuffle algorithm; shuffles arrays in place.
		for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
    	}
    	return array;
	}
	writeFile(bin, toursize, tour){
		var check = 0;

		if (bin == 0){
			check = this.tour.currentBestA;
		}
		else {
			check = this.tour.currentBestB;
		}

		if (check > toursize){
			var loc = "cmkv68/TourFile";
			var filename = "tour" + this.tour.title;
			filename += ".txt";
			console.log("Writing to file...");

			if (bin == 0){
				loc += "A/";
			} else {
				loc += "B/";
			}
			console.log("wahoey " + loc + filename);
			var file = fs.createWriteStream(loc + filename);
			file.on('error', function(err) { /* error handling */ });
			file.write("NAME = " + this.tour.title + ',\n');
			file.write("TOURSIZE = " + this.tour.size + ',\n');
			file.write("LENGTH = " + toursize + ',\n');
			file.write(tour.toString() + '\n');
			file.end();
			console.log("File written to " + filename);
		} else {
			console.log("toursize isn't better than best on file (currently " + check+")");
		}
	}
}

class Genetic{
	constructor(map){
		console.log("running Genetic Algorithm");
		this.map = map;
		this.mutation_rate = 0.1;
		// this.crossover_rate = 0.3;
		this.population_size = 10;
		this.population = []; // randomly generated initial population
		this.generations = 1000;
		this.generatePopulation();
		this.lapGenerations();
	}
	removeDuplicates(s){
		var k = {};
	    return s.filter(function(i) {
	        return k.hasOwnProperty(i) ? false : (k[i] = true);
	    });
	}
	crossover(x,y){
		var out = new Human([],0)
		var n = x.tour.length -1 ;
		var half = Math.ceil(x.tour.length / 2);

		//onecheck
		var a = [...x.tour.slice(0,half)];
		var b = [...y.tour.slice(half,n)];
		a.push.apply(a,b);
		// console.log("a: " + a);
		a = this.removeDuplicates(a);
		a = this.checkmissing(a);
		a = this.mutate(a);
		// console.log("a: " + a);
		var arange = this.map.crawl(a);

		//twocheck
		var c = [...y.tour.slice(0,half)];
		var d = [...x.tour.slice(half,n)];
		c.push.apply(c,d);
		// console.log("len" + c.length+d.length)
		// console.log("c: "+c);
		c = this.removeDuplicates(c);
		c = this.checkmissing(c);
		c = this.mutate(c);
		// console.log("c: " + c);
		var crange = this.map.crawl(c);

		if (arange > crange){
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
	checkmissing(x){
		var missing = [];
		for (var i = 0; i < this.map.size; i++){
			if (x.includes(i) == false){
				missing.push(i);
			}
		}
		// console.log("missing: " + missing);
		missing = this.map.shuffle(missing);
		// console.log("mis_shuf: " + missing)
		// console.log(x);
		x.push.apply(x, missing);
		// console.log(x);
		return x;
	}
	generatePopulation(){
		// generates the population
		for (var i  = 0; i < this.population_size; i++){
			var tour = this.generateRandom();
			var length = this.map.crawl(tour);
			var human = new Human(tour,length);
			this.population.push(human);
		}
	}
	sortByPedigree(a,b){
		if (a.size === b.size){
			return 0;
		}
		else {
			return (a.size < b.size) ? 1:1;
		}
	}
	lapGenerations(){
		var supreme = new Human([],Number.MAX_VALUE);
		for(var i = 0; i < this.generations; i++){
			console.log("Generation " + i);
			var next_population = [];
			var fittest_individual = new Human([],0);
			for (var j in this.population){
				var rand1 = Math.ceil(Math.random() * this.population_size) - 1;
				var rand2 = Math.ceil(Math.random() * this.population_size) - 1;

				var x = this.population[rand1];
				var y = this.population[rand2];

				// make new human.
				var z = this.crossover(x,y);

				next_population.push(z);

				// check for master human.
				if (z.size < supreme.size){
					supreme = z;
					console.log("Generation: " + i + " New Supreme: " + supreme.size + " - " + supreme.tour)
					this.map.writeFile(0, supreme.size, supreme.tour);
					console.log("ww");
				}
			}
			// will need to sort the array based on how good the population is.
			next_population.sort();

			this.population = next_population;
		}

		for (var i = 0; i < supreme.tour.length; i++){
			supreme.tour[i] += 1;
		}
		console.log("MASTER: " + supreme.size + " " + supreme.tour);
		console.log("22");
		this.map.writeFile(0, supreme.size, supreme.tour);
	}
	generateRandom(){
		var array = []
		for (var i = 0; i < this.map.size; i++){
			array.push(i);
		}
		array = this.map.shuffle(array);
		return array;
	}
	mutate(k){
		// console.log("lol");
		if (Math.random() < this.mutation_rate){
			// console.log(" - mutation detected");
			var size = k.length - 1;
			// console.log(size);

			var a = Math.round((Math.random() * size) -1)
			var b = Math.round((Math.random() * size) -1)
			var temp = k[b];
			k[b] = k[a];
			k[b] = temp;
		}
		return k;
	}
}
class Annealing{
	constructor(map){
		this.map = map;
		var bigboy;
		var length;
		this.anneal();
	}
	generateRandom(){
		var array = []
		for (var i = 0; i < this.map.size; i++){
			array.push(i);
		}
		array = this.map.shuffle(array);
		return array;
	}

	anneal(){
		console.log("initialising annealing.");
		var T = 10000;
		var T_min = 0.00001;
		var alpha = 0.9;
		var rounds = 100;
		this.bigboy = this.generateRandom();
		this.length = this.map.crawl(this.bigboy);
		// console.log(this.bigboy);
		// console.log(this.length);
		console.log("running annealing");
		while (T > T_min){
			for (var i = 0; i < rounds; i++){
				var new_sol = this.mutate(this.generateRandom())
				// console.log(new_sol.length)
				var new_cost = this.map.crawl(new_sol)
				var ap = this.acceptance_probability(this.length, new_cost, T)
				if (ap > Math.random()){
					this.bigboy = new_sol;
					this.length = new_cost;
					// console.log(this.length);
				}
			}
			T = T * alpha
		}
		// console.log("Best toursize: " + this.length + " - " + this.bigboy);
		for (var i = 0; i < this.bigboy.length; i++){
			this.bigboy[i] += 1;
		}
		this.map.writeFile(1, this.length, this.bigboy);
		// console.log(this.bigboy);
	}

	acceptance_probability(old,ne,T){
		var a = 0;
		if (ne < old){
			a = 1;
		}
		else {
			if (old/2 > ne) {
				a = 0.5;
			}
			if (old/3 > ne) {
				a = 0.3;
			}
			if (old/4 > ne) {
				a = 0;
			}
		}
		return a;
	}

	mutate(k){
		var size = k.length - 1;
		// console.log(size);
		var a = Math.round((Math.random() * size) -1)
		var b = Math.round((Math.random() * size) -1)
		var temp = k[b];
		k[b] = k[a];
		k[b] = temp;
		return k;
	}
}
var map1 = new TourFile("cityfiles/AISearchtestcase.txt");
// var map1 = new TourFile("cityfiles/AISearchfile012.txt");
// var map2 = new TourFile("cityfiles/AISearchfile017.txt");
// var map3 = new TourFile("cityfiles/AISearchfile021.txt");
// var map4 = new TourFile("cityfiles/AISearchfile026.txt");
// var map5 = new TourFile("cityfiles/AISearchfile042.txt");
// var map6 = new TourFile("cityfiles/AISearchfile048.txt");
// var map7 = new TourFile("cityfiles/AISearchfile058.txt");
// var map8 = new TourFile("cityfiles/AISearchfile175.txt");
// var map9 = new TourFile("cityfiles/AISearchfile180.txt");
// var map10 = new TourFile("cityfiles/AISearchfile535.txt");
// console.log(map1.matrix);
// brute(map1);
// var l = new Annealing(map1);
// var k = new Genetic(map1);

"use strict";
var fs = require('fs');
var sys = require('util');
var exec = require('child_process').exec;
var brute = require('./brute.js');

class TourFile{
	constructor(location){
		this.title = "";
		this.location = location;
		this.size = 0;
		this.matrix = [];
		this.readItem();
		this.currentBestA = 901239123091209390123;
		this.currentBestB = 901239123091209390123;
		// this.loadResult();
		console.log(this.currentBestA);
		console.log(this.currentBestB);

		// Runs Brute Force Algorithm
		// brute.bruteforce(this);

		var l = new Annealing(this);
		var k = new Genetic(this);

	}
	getMatrix(){
		return this.matrix;
	}
	getSize(){
		return this.size;
	}
	getLocation(){
		return this.location;
	}
	getTitle(){
		return this.title;
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

		this.size = line;
		this.matrix = new Array(line).fill(-1);
	}
	readItem(){
		console.log("Reading File...");
		var data = fs.readFileSync(this.location, 'utf8');
		// How you'd find a line break varies between operating system encodings. Windows would be \r\n but Linux just uses \n and Apple uses \r.
		console.log("File read");
		data = data.replace(/(\r\n|\n|\r)/gm,"");
		// splits data by comma.
		data = data.split(",");
		// extract name (first item in array)
		// data.shift().split("l")[1].replace(/\s/g, '');
		this.title = data.shift().split("=")[1].replace(/\s/g, '');
		console.log("Map " + this.title + " is initialising");
		// extract size (first item in array)
		this.size = data.shift().replace(/[^0-9\-]/g,'');
		// sanitise tour data.
		this.sanitiseTours(data);

		// console.log(data);

		// need to generate matrix.
		this.generateMatrix();

		//fill matrix with goods.
		console.log("Filling Matrix...");
		this.fillMatrix(data);
		console.log(this.size + " items are initialised in the matrix.");
	}
	generateMatrix(){
		for (var i = 0; i < this.size; i++){
			this.matrix[i] = new Array(this.size);
		}
		for (var i = 0; i < this.matrix.length; i++){
			for (var j = 0; j < this.matrix.length; j++){
				this.matrix[j][i] = -1;
			}
		}
	}
	fillMatrix(data){
		var k = 0;
		//plot data into matrix, runs in o(n) time.
		for (var i = 0; i < this.matrix.length; i++){
			for (var j = 0; j < this.matrix.length; j++){
				if (this.matrix[j][i] == -1){
					if (i == j){
						// distance between a city to itself is 0.
						this.matrix[j][i] = 0
					}
					else {
						// poll data from one location to another
						this.matrix[j][i] = data.shift();
						// transpose.
						this.matrix[i][j] = this.matrix[j][i];
					}
				}
			}
			var v = (i/this.matrix.length * 100).toFixed(0);
			if (v > k){
				console.log("loading matrix: " + v + "%");
			}
			k = v;
		}
	}
	sanitiseTours(data){
		for (var i = 0; i < data.length; i++){
			data[i] = data[i].replace(/[^0-9\-]/g,'');
		}
	}
	crawl(list){
		// console.log("running crawl");
		var size = 0;
		var start_city = list[0];
		var current_pos = list[0];

		for (var i = 0; i < list.length -1; i++){
			var next_pos = list[i+1]
			size += parseFloat(this.matrix[current_pos][next_pos]);
			current_pos = next_pos;
		}
		size += parseFloat(this.matrix[current_pos][start_city]);
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
			check = this.currentBestA;
		}
		else {
			check = this.currentBestB;
		}

		if (check > toursize){
			var loc = "cmkv68/TourFile";
			var filename = "tour" + this.title;
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
			file.write("NAME = " + this.title + ',\n');
			file.write("TOURSIZE = " + this.size + ',\n');
			file.write("LENGTH = " + toursize + ',\n');
			file.write(tour.toString() + '\n');
			file.end();
			console.log("File written to " + filename);
		} else {
			console.log("toursize isn't better than best on file (currently " + check+")");
		}
	}
	loadResult(bin){
		console.log("----")
		console.log("loading results")
		var loc = "cmkv68/TourFile";

		var filename = "tour" + this.title + ".txt";
		console.log("Searching for file " + filename);

		console.log("initialising A")
		fs.access(loc + "A/" + filename, fs.F_OK, function(err) {
		    if (!err) {

		        var data = fs.readFileSync(loc + "A/" + filename, 'utf8');
				// console.log("File Found;");
				if (data){
					data = data.replace(/(\r\n|\n|\r)/gm,"").split(",");
					console.log(data);
					this.currentBestA = data[2].split("=")[1].replace(/\s/g, '');
					console.log("File Found; best length:", this.currentBestA);
				} else {
					console.log("file found but nothing inside");
				}
		    } else {
		        console.log("File isn't found; continue.");
		    }
		});
		console.log("initialising B")
		fs.access(loc  + "B/" + filename, fs.F_OK, function(err) {
		    if (!err) {
		        var data = fs.readFileSync(loc  + "B/" + filename, 'utf8');
				// console.log("File Found;");
				if (data){
					data = data.replace(/(\r\n|\n|\r)/gm,"").split(",");
					console.log(data);
					this.currentBestB = data[2].split("=")[1].replace(/\s/g, '');
					console.log("File Found; best length:", this.currentBestB);
				} else {
					console.log("file found but nothing inside.");
				}
		    } else {
		        console.log("File isn't found; continue.");
		    }
		});
		console.log("----")
	}
}
class Human{
	constructor(t,s){
		this.tour = t;
		this.size = s;
	}
}
class Genetic{
	constructor(map){
		console.log("running Genetic Algorithm");
		this.map = map;
		this.mutation_rate = 0.1;
		// this.crossover_rate = 0.3;
		this.population_size = 10000;
		this.population = []; // randomly generated initial population
		this.generations = 100000;
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
			// console.log("Generation " + i);
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
// var map1 = new TourFile("cityfiles/AISearchtestcase.txt");
// var map1 = new TourFile("cityfiles/AISearchfile012.txt");
// var map2 = new TourFile("cityfiles/AISearchfile017.txt");
// var map3 = new TourFile("cityfiles/AISearchfile021.txt");
// var map4 = new TourFile("cityfiles/AISearchfile026.txt");
// var map5 = new TourFile("cityfiles/AISearchfile042.txt");
// var map6 = new TourFile("cityfiles/AISearchfile048.txt");
// var map7 = new TourFile("cityfiles/AISearchfile058.txt");
// var map8 = new TourFile("cityfiles/AISearchfile175.txt");
// var map9 = new TourFile("cityfiles/AISearchfile180.txt");
var map10 = new TourFile("cityfiles/AISearchfile535.txt");
// console.log(map1.matrix);
// brute(map1);
// var l = new Annealing(map1);
// var k = new Genetic(map1);

function puts(error, stdout, stderr) {
	console.log(stdout);
}
console.log("Running Python Check");
exec("python validtourcheck.py", puts);
console.log(fs.readFileSync("trace.txt", 'utf8'));

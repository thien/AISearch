var fs = require('fs');

module.exports.crawl = function(list, map) {
	// console.log("running crawl");
	var size = 0;
	var start_city = list[0];
	var current_pos = list[0];

	for (var i = 0; i < list.length - 1; i++) {
		var next_pos = list[i + 1]
		size += parseFloat(map.matrix[current_pos][next_pos]);
		current_pos = next_pos;
	}
	size += parseFloat(map.matrix[current_pos][start_city]);
	return size;
}

module.exports.shuffle = function(array){
	return shuffle(array);
}

function shuffle(array){
	// Durstenfeld shuffle algorithm; shuffles arrays in place.
	for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
	}
	return array;
}

module.exports.removeDuplicates = function(s) {
	var k = {};
	return s.filter(function(i) {
		return k.hasOwnProperty(i) ? false : (k[i] = true);
	});
}

module.exports.generateRandom = function(size) {
		var array = []
		for (var i = 0; i < size; i++) {
			array.push(i);
		}
		array = shuffle(array);
		return array;
}

module.exports.checkmissing = function(x, map) {
		var missing = [];
		for (var i = 0; i < map.size; i++) {
			if (x.includes(i) == false) {
				missing.push(i);
			}
		}
		// console.log("missing: " + missing);
		missing = shuffle(missing);
		// console.log("mis_shuf: " + missing)
		// console.log(x);
		x.push.apply(x, missing);
		// console.log(x);
		return x;
	}

module.exports.sortByPedigree = function(a,b){
	if (a.size === b.size) {
			return 0;
		} else {
			return (a.size < b.size) ? 1 : 1;
		}
}

module.exports.savePosition = function(tourdata, letter){
	var output = "";
	var loc = "cmkv68/TourFile" + letter + "/";
	var filename = "tour" + tourdata.title + ".json";
	var location = loc + filename;
	// console.log("Writing to file...");

	// console.log("wahoey " + loc + filename);

	// output += "NAME = " + tourdata.title + ',\n';
	// output += "TOURSIZE = " + tourdata.size + ',\n';
	// output += "LENGTH = " + tourdata.length + ',\n';
	// output += tourdata.tour.toString() + '\n';

	output = JSON.stringify(tourdata);

	fs.writeFileSync(location, output);
	console.log("File written to " + location);
}

module.exports.loadPosition = function(letter, map){
	var loc = "cmkv68/TourFile" + letter + "/tour" + map.title +".json";
	try {
		fs.accessSync(loc);
		// it exists
		// check if it's better than what we have
		console.log(loc + " exists");
		// console.log("contents of loc: " + loc);
		return JSON.parse(fs.readFileSync(loc, 'utf8'));
	} catch (e) {
		// doesn't exist.
		console.log(loc + " doesn't exist")
		return {
			"title": map.title,
			"toursize": parseInt(map.size),
			"tourlength": Number.MAX_VALUE,
			"tour": []
		}
	}
}

module.exports.mutate = function(k, method, done) {
		// console.log("mutating");
		// console.log(k);
		var size = k.length - 2;
		var mutation = k.concat();

		if (method == "random"){
			// swap with random positions
			var x = Math.round((Math.random() * size) + 1);
			var y = x;
			while (x == y){
				y = Math.round((Math.random() * size) + 1);
			}
		}
		if (method == "neighbouring"){
			// swap with neighbouring positions
			var x = Math.round((Math.random() * size));
			var y = x+1;
		}

		// swap positions
		var b = mutation[y];
		mutation[y] = mutation[x];
		mutation[x] = b;

		// console.log(mutation);
		// console.log("mutation done")
		done(null, mutation);
		// return mutation;
		// console.log(k);
	}
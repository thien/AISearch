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

module.exports.shuffle = function(array) {
    return shuffle(array);
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
module.exports.savePosition = function(tourdata, letter) {
    var output = "";
    var user = "cmkv68/"
    var loc = user + "Tourfile" + letter + "/";
    var filename = "tour" + tourdata.title + ".json";
    var location = loc + filename;
    // console.log("Writing to file...");

    // console.log("wahoey " + loc + filename);

    // output += "NAME = " + tourdata.title + ',\n';
    // output += "TOURSIZE = " + tourdata.size + ',\n';
    // output += "LENGTH = " + tourdata.length + ',\n';
    // output += tourdata.tour.toString() + '\n';

    output = JSON.stringify(tourdata);
    if (!fs.existsSync(user)){
        fs.mkdirSync(user);

        if (!fs.existsSync(loc)){
            fs.mkdirSync(loc);
            fs.writeFileSync(location, output);
        }
        else {
            fs.writeFileSync(location, output);
        }
    } else {
        if (!fs.existsSync(loc)){
            fs.mkdirSync(loc);
            fs.writeFileSync(location, output);
        }
        else {
            fs.writeFileSync(location, output);
        }
    }
    // fs.writeFileSync(location, output);
    console.log("File written to " + location);
}

module.exports.loadPosition = function(letter, map) {
    var loc = "cmkv68/Tourfile" + letter + "/tour" + map.title + ".json";
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

module.exports.mutate = function(k, rate, method, done) {
    // console.log("mutating");
    // console.log(k);
    if (Math.random() > rate) {
        var size = k.length - 2;
        var mutation = k.concat();

        if (method == "random") {
            // swap with random positions
            var x = Math.round((Math.random() * size) + 1);
            var y = x;
            while (x == y) {
                y = Math.round((Math.random() * size) + 1);
            }
        }
        if (method == "neighbouring") {
            // swap with neighbouring positions
            var x = Math.round((Math.random() * size));
            var y = x + 1;
        }

        // swap positions
        var b = mutation[y];
        mutation[y] = mutation[x];
        mutation[x] = b;
        done(null, mutation);
    } else {
        done(null, k);
    }
}

module.exports.mutate_ps = function(k,prob,done){
	// partial shuffle mutation
	// https://arxiv.org/pdf/1203.3099.pdf
	var mutation = k.concat();
	// console.log(k)
	var i = 1;
	var n = k.length - 1;
	while (i < n){
		// console.log("iterating")
		var p = Math.round(Math.random())
		// console.log(p, prob)
		if (p < prob){
			// console.log("yes")
			var j = Math.round(Math.random() * n);
			// swap positions
	        var b = mutation[j];
	        mutation[j] = mutation[i];
	        mutation[i] = b;
		}
		i++;
	}
	// console.log(mutation)
	done(null, mutation);

}

module.exports.sortByPedigree = function(array) {
    // http://stackoverflow.com/questions/8175093/simple-function-to-sort-an-array-of-objects
    return array.sort(function(a, b) {
        var x = a.size;
        var y = b.size;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

module.exports.convertResultTxt = function(file){
    // console.log("file:", file)
	if (file.includes(".json")){
		try {
	        fs.accessSync(file);
	        // it exists
	        // check if it's better than what we have
	        console.log(file + " exists");
	        // console.log("contents of loc: " + loc);
	        var data = JSON.parse(fs.readFileSync(file, 'utf8'));
	        // console.log(JSON.stringify(data));
	        var file_location = file.replace(".json", ".txt");
	        var text_document = "";
	        text_document += "NAME = " + data.title + ",\n";
	        text_document += "TOURSIZE = " + data.toursize + ",\n";
	        text_document += "LENGTH = " + data.tourlength + ",\n";
            if (data.method == "annealing"){
                for (var i in data.tour){
                    data.tour[i] += 1;
                }
                text_document += data.tour.toString()
                fs.writeFileSync(file_location, text_document);
            } else {
                text_document += data.tour.toString()
                fs.writeFileSync(file_location, text_document);
            }
	        // text_document += data.tour.toString()
	        // fs.writeFileSync(file_location, text_document);
	    } catch (e) {
	        // doesn't exist.
	        console.log(e);
	        console.log(file + " isn't a .json file.")
	    }	
	}
}
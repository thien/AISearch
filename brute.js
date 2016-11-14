var comb = require('js-combinatorics');

module.exports = {
  bruteforce: function (map) {
	// console.log(map.matrix);
	var smallest_toursize = Number.MAX_VALUE;
	var fastest_order = [];

	var init = [];
	for (i = 0; i < map.matrix.length; i++){
		init.push(i);
	}

	// array of permutations
	var permutations = comb.permutation(init).toArray();

	// iterate through permutations
	for (var i = 0; i < permutations.length; i++){
		//initialise size of tour
		var toursize = 0;
		var start_city = permutations[i][0];
		var current_pos = start_city;


		for (var j = 0; j < permutations[i].length-1; j++){
			// console.log(permutations[i])
			var next_pos = permutations[i][j+1]
			// console.log(map.matrix[current_pos][next_pos]);
			toursize += parseFloat(map.matrix[current_pos][next_pos]);
			// console.log(toursize);
			current_pos = next_pos;

		}
		// add last connection back to the original.
		toursize += parseFloat(map.matrix[current_pos][start_city]);

		if (toursize < smallest_toursize){
			smallest_toursize = toursize;
			fastest_order = permutations[i];
		}
		// console.log(toursize, "", permutations[i]);
	}
	console.log("smallest: ", smallest_toursize, " ", fastest_order);
  }
};
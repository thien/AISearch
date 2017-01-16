var bf = require('./basefunctions.js');
module.exports.bfs = function(size, matrix, start_city) {
	// console.log("-------------------------------------------------------------------")
	var current_city = start_city
	var travelled_cities = []
	travelled_cities.push(current_city);
	// console.log(current_city)
	// loop for all cities
	while (travelled_cities.length < matrix.length +1 ){
		// console.log(travelled_cities.slice(0).sort())cx   
		// console.log("current city:", current_city, " - toursize", travelled_cities.length)
		closestNeighbour(current_city, travelled_cities, matrix, function(city){
			current_city = city;
			travelled_cities.push(current_city);
		})
		// add neighbour to travelled cities.
	}
	// var length = bf.crawl(travelled_cities, map);
	// console.log(travelled_cities)
	// console.log("no cities", travelled_cities.length)
	// console.log(length)
	return travelled_cities;
	// done(travelled_cities);
};

closestNeighbour = function(current_city, travelled_cities, matrix, done){
	var closest_city = 0
	var closest_value = Number.MAX_VALUE;
	for (var i = 0; i < matrix.length; i++){
		// check if city has not been traversed
		if (travelled_cities.includes(i) == false){
			// check if this is the smallest value
			if (matrix[current_city][i] < closest_value){
				closest_city = i;
				closest_value = matrix[current_city][i]
			}
		}
	}
	done(closest_city);
}
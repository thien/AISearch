class Human{
	constructor(t,s){
		this.tour = t;
		this.tour.size = s;
	}
}

module.exports = {
    Genetic: function (map) {
		console.log("running Genetic Algorithm");

		this.map = map;
		this.mutation_rate = 0.1;
		// this.crossover_rate = 0.3;
		this.population_size = 10;
		this.population = []; // randomly generated initial population
		this.generations = 1000;
		generatePopulation();
		lapGenerations();
    }
}
function removeDuplicates(s){
    var k = {};
    return s.filter(function(i) {
        return k.hasOwnProperty(i) ? false : (k[i] = true);
    });
}
function crossover(x,y){
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
function checkmissing(x){
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
function generatePopulation(){
    // generates the population
    for (var i  = 0; i < this.population_size; i++){
        var tour = this.generateRandom();
        var length = this.map.crawl(tour);
        var human = new Human(tour,length);
        this.population.push(human);
    }
}
function sortByPedigree(a,b){
    if (a.size === b.size){
        return 0;
    }
    else {
        return (a.size < b.size) ? 1:1;
    }
}
function lapGenerations(){
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
function generateRandom(){
    var array = []
    for (var i = 0; i < this.map.size; i++){
        array.push(i);
    }
    array = this.map.shuffle(array);
    return array;
}
function mutate(k){
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

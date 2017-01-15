## Map Parser

The interpreter reads the dirty data files from `/cityfiles/*` and sanitizes it appropriately in order to generate metadata about the file. A matrix is generated allowing the data to be read in the tour to be read using a path representation, where city _i_ is the _j-th_ element of the list. The tour 3-2-4-1-5-7-8-6 can be represented by:

	(32415786).

An object is _map_ formed which comprises of a title, file location, number of cities, a matrix of the cities, the current best, raw data and raw positions. The object is then saved locally in `/data/*` in order save processing time as generating a matrix is expensive on the resources (especially in the case of the 535 cities.)

This is then fed to the two methods used: A - Simulated Annealing and B - Genetic Algorithms. Both methods will check for work in progress tours (results are cached accordingly); if there is then it will continue working on that; otherwise it will start from the beginning.

## Utilities for our TSP Methods

### Path Generation

### Mutation


## A - Simulated Annealing

The approach to simulated annealing is relatively simple. It models the process undergone by misplaced atoms in an object when heated; and slowly cooled down, attempting to find a global minimum of the tours. While this method will unlikely find the optimum solution, it can often find a very good solution.

It works by 
- 
- looping 1,000,000 steps or reaches zero
- generating a random path to tour to
- determining whether the path should be taken
	- if the path is better then take it
	- if the path isn't take it with a probability.

- Probablistic Methods
multiple decisions have been chosen as there are two aspects of the annealing model that can be subject to probability:

- the generation of the 'adjacent' path
- the likelyhood of moving towards the new path

## Generation of Adjacent Path

A new path will be generated, whether two positions are randomly switched around, or 
I have sampled multiple methods

### Neighbouring Mutation

A neighbouring mutation has the most 



### Random Mutation

I have chosen the random mutation as it is 

2x mutation:
78319

1x mutation:
72702

## Probability of Path Switching

Our cost functions will be the length of the generated tours.

Possibly the most important aspect of the annealing method, we may sometimes have to accept the worse tour as it may be the stepping stone that could get close to the global minima as opposed to staying in the local minima. I have chosen the three methods as below as my probability function.


- e^(lo - l1 / T)
- e^(-lo / T)

These formulas all decrease proportional to the number of steps incremented already. They grow in an expoential fashion, in order to simulate the temperature of a object cooling. The cooler the object, the less likely we will take the neighbouring tour.


## B - Genetic Algorithm

Our genetic algorithm works as follows:

- A population of size N is generated
- Children are created from the population using a crossover method
- The child face a mutation based on probability
- with N amount of children generated, this will be the new population
- The best child in the population will be the most favourite tour;
- repeat for as many generations as liked.

### Generation of Population

At the first generation, each member of the population is generated randomly; such that each member has a random sort of a numbers which represent the tours. A tourlength is generated based on tour.

### Crossover Method

#### Vanilla Method

#### PMX Method

#### Split Method

- get the left half of one parent and the right half of the other parent
- make a new child by merging the two together
- check for duplicate tours
- check for missing tours
- add missing tours in random order

computationally slower

### Mutation Method

#### Neighbouring Mutation

<!-- Full and clear descriptions of your implementations, focusing on 

implementation issues (do not include your code in your report; 
focus on an overview of how your implementation works and on 
any specific implementation details 
	- such as choice of data structures
	- data representation, 
	- use of probabilistic methods, 
	- technical aspects of specific algorithms 
		ex. crossover and mutation in a genetic algorithm. 


	// --- PSEUDOCODE

	// current = initial state
	// for t = 1 to infinity:
	// 	t = schedule[t]
	// 	if t = 0
	// 		then return current
	// 	else
	// 		choose successos of current at random
	// 		delta e = f(successor) - f(current)
	// 		if delta e >= 0
	// 			then current = successor
	// 		else
	// 			current = successor with probability e^(delta e/t)


<!-- A thorough (tabulated) description of your results so that you specify the lengths of the best tours obtained (of course, these lengths are witnessed by the tour-files that you have submitted). The better the tours you find, the better the marks. There are [6 marks] available as regards tour quality. -->

## Results

<!-- Details of your experiences with your implementations and the fine- tuning and experimentation that you undertook in order to try and improve performance. There are [6 marks] available as regards exper- imentation. -->
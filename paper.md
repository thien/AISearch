
AI Search
===================
##### cmkv68 - Durham University

## Map Parser

The interpreter reads the dirty data files from `/cityfiles/*` and sanitizes it appropriately in order to generate metadata about the file. A matrix is generated allowing the data to be read in the tour to be read using a path representation, where city _i_ is the _j-th_ element of the list. The tour 3-2-4-1-5-7-8-6 can be represented by:

	(32415786).

An object is _map_ formed which comprises of a title, file location, number of cities, a matrix of the cities, the current best, raw data and raw positions. The object is then saved locally in `/data/*` in order save processing time as generating a matrix is expensive on the resources (especially in the case of the 535 cities.)

This is then fed to the two methods used: A - Simulated Annealing and B - Genetic Algorithms. Both methods will check for work in progress tours (results are cached accordingly); if there is then it will continue working on that; otherwise it will start from the beginning.

## Utilities for our TSP Methods

### Path Generation

Path generation 

### Mutation


## A - Simulated Annealing

The simulated annealing method is a more deterministic model of the hill climbing algorithm. The introduction of randomness allows the method to escape local maximums, allowing it to have a better chance of finding a global maximum.

The approach to simulated annealing is relatively simple. It models the process undergone by misplaced atoms in an object when heated; and slowly cooled down, attempting to find a global minimum of the tours. While this method will unlikely find the optimum solution, it can often find a very good solution. A structured English algorithm is described below:

	- looping 1,000,000 steps or reaches zero
	- generating a random path to tour to
	- determining whether the path should be taken
		- if the path is better then take it
		- if the path isn't take it based on a probability.

- Probablistic Methods
multiple decisions have been chosen as there are two aspects of the annealing model that can be subject to probability:

- the generation of the 'adjacent' path
- the likelyhood of moving towards the new path

## Generation of Adjacent Path

The mutation methods are chosen due to its simplicity.

### Neighbouring Mutation

A neighbouring mutation is produced by finding a random position `N` within the path and switching its position with the city `N+1`. For example, if city `2` was chosen in the tour `1,2,3,4,5,6,7,8`, then the mutation would return `1,3,2,4,5,6,7,8`. If the city chosen is the last city in the list, then it would be replaced with the first city in the list.

### Random Mutation

Random mutation is produced by finding two random positions in the path and switching their positions with each other; for example in the tour `1,2,3,4,5,6,7,8`, a Random Number Generator is used to get the cities `2`, and `6`. These two cities are swapped leading to the tour path `1,6,3,4,5,2,7,8`. 

### Testing of Mutation Methods

Below I conducted a test between the two mutation methods, in order to decide on the best option for the Annealing method. The mutation methods will be used against three tours, `AISearchfile042`, `AISearchfile175` and `AISearchfile535`. The test will use the same path switching method, and the results would be the average of 5 runs of the annealing method, in order to reduce the significance that entropy applies to the mutation methods.

The multiplier column represents how many laps of mutation the tour has gone through, where a multiplier of 2 means that the tour has undergone two mutations. The tour column represents the search-file the annealing algorithm is implemented on. 

| Tour Method  | Multiplier | Tour | Result (Average Tour Length) |
|--------------|------------|------|------------------------------|
| Random       | 1          | 535  | 74129						  |
| Random       | 2          | 535  | 80680						  |
| Neighbouring | 1          | 535  | 134689	 					  |
| Neighbouring | 2          | 535  | 121356	 					  |
| Random       | 1          | 175  | 26874						  |
| Random       | 2          | 175  | 31791						  |
| Neighbouring | 1          | 175  | 42517	 					  |
| Neighbouring | 2          | 175  | 39807	 					  |
| Random       | 1          | 042  | 1379						  |
| Random       | 2          | 042  | 1344						  |
| Neighbouring | 1          | 042  | 2290	 					  |
| Neighbouring | 2          | 042  | 2132	 					  |

Overall, the Random Mutation swap with a 1x multiplier performed the best, followed by the Random 2x. The neighbouring 1x performed last. This led to using the Random 1x swap being used in the final method.

The case for more mutations detrimentally affecting the performance of the mutation may be related to the fact that the tour would deviate further from its tour direction.
The more dramatic the entropy, the 

Issues that the results may face is generally based on the fact that the annealing algorithm is a deterministic method, leading to the contribution of randomness still having a large impact of the results, regardless of efforts to mitigate its factor in the results.

Overall, it has shown that the Random mutation method with a 1x multiplier has performed the best. This method will be included with the final annealing approach.

## Path Switching

Our cost functions will be the length of the generated tours.

Possibly the most defining aspect of the annealing method, we may sometimes have to accept the worse tour as it may be the stepping stone that could get close to the global minima as opposed to staying in the local minima. I have chosen the three methods as below as my probability function.

	1. e^(lo - l1 / T)
	2. e^(-lo / T)

These formulas all decrease proportional to the number of steps incremented already. They grow in an exponential fashion, in order to simulate the temperature of a object cooling. The cooler the object, the less likely we will take the neighbouring tour.

## Cooling Method

	T = 1/log(step)
	T = alpha * T (Kirkpatrick - psychicorigami simulated annealing)

I have found that the cooling method has an insignificant factor in contributing to the effectiveness of the tour length.

---------------------------------------------------------------------------

## B - Genetic Algorithm

Our genetic algorithm works as follows:

- A population of size N is generated
- Children are created from the population using a crossover method
- The child face a mutation based on probability
- with N amount of children generated, this will be the new population
- The best child in the population will be the most favorite tour;
- repeat for as many generations as liked.

### Generation of Population

At the first generation, each member of the population is generated randomly; such that each member has a random sort of a numbers which represent the tours. A tour-length is generated based on tour. Issues related to this may include:

- Population will have incredibly contrasting results; with a good chance of a generated path being poor, tour-size wise.
- 

Another method I have considered is to generate each member of the population by a basic greedy closest neighboring algorithm. This would allow us to ensure that the starting population will start with a relatively good results. There may be several issues related to this:

- More computationally expensive to produce


### Crossover Method

#### Vanilla Method

#### PMX Method

 partially mapped crossover, goldberg & lingle (1985)

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


<!-- 
| Random       | 1          | 535  | 72994 		  		  |
| Random       | 1          | 535  | 75242 		  		  |
| Random       | 1          | 535  | 74152 		  		  |

| Random 	   | 2          | 535  | 80123	 			  |
| Random 	   | 2          | 535  | 79501 				  |
| Random 	   | 2          | 535  | 82417 				  |

| Neighbouring | 1          | 535  | 133571	 			  |
| Neighbouring | 1          | 535  | 135923	 			  |
| Neighbouring | 1          | 535  | 134572	 			  |

| Neighbouring | 2          | 535  | 121023 			  |
| Neighbouring | 2          | 535  | 123812		  		  |
| Neighbouring | 2          | 535  | 119232 		  	  |

| Random       | 1          | 175  | 27174 		  		  |
| Random       | 1          | 175  | 27015 		  		  |
| Random       | 1          | 175  | 26432 		  		  |

| Random       | 2          | 175  | 26382 		  		  |
| Random       | 2          | 175  | 26995 		  		  |
| Random       | 2          | 175  | 27001 		  		  |

| Neighbouring | 1          | 175  | 42876 		  		  |
| Neighbouring | 1          | 175  | 41678 		  		  |
| Neighbouring | 1          | 175  | 42997 		  		  |

| Neighbouring | 2          | 175  | 39314 		  		  |
| Neighbouring | 2          | 175  | 40125 		  		  |
| Neighbouring | 2          | 175  | 39982 		  		  |

| Random       | 1          | 042  | 1352 		  		  |
| Random       | 1          | 042  | 1373 		  		  |
| Random       | 1          | 042  | 1411 		  		  |

| Random       | 2          | 042  | 1321 		  		  |
| Random       | 2          | 042  | 1371 		  		  |
| Random       | 2          | 042  | 1339 		  		  |

| Neighbouring | 1          | 042  | 2453 		  		  |
| Neighbouring | 1          | 042  | 2134 		  		  |
| Neighbouring | 1          | 042  | 2284 		  		  |

| Neighbouring | 2          | 042  | 1969 		  		  |
| Neighbouring | 2          | 042  | 2277 		  		  |
| Neighbouring | 2          | 042  | 2149 		  		  | -->
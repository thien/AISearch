
AI Search
===================
##### _cmkv68 - Durham University_

<!-- pandoc -o output.docx -f markdown -t docx paper.md -->

# TourfileA - Simulated Annealing
<!-- 
// PSEUDOCODE

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
// 			current = successor with probability e^(delta e/t) -->

The initial implementation consisted of setting alpha `a = 0.9` and temperature `T = 2000` variables. This was followed by generating an initial state (our path) randomly. A while loop is then used where a possible successor state is generated using a 1x mutation. The tourlengths of the states are compared, with the initial state being replaced with the successor if its tour length is better, otherwise it will switch dependent on our probablistic approach. The probability `a` is deduced as so:

	- if initial/2 > possible_sucessor
		a = 0.5
	- if initial/3 > possible_sucessor
		a = 0.3
	- else:
		a = 0

`T` is then called by multiplying itself with `a`. This loop continues until `T = 0`, or 100000 steps are performed. 

|  Intial | Test | 12 | 17 | 21 | 26 | 42 | 48 | 58 | 175 | 180 | 535 |
|  ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
|  Annealing | 28 | 68 | 2085 | 4255 | 1945 | 2356 | 35469 | 89216 | 45198 | 736040 | 148321 |

## Experimentation

The initial path generation remained random. This was kept to reduce possibilities of leading towards a local maximum. I decided to keep the 1x Random __generation of Neighbouring Path (Mutation)__, as my results have shown that it has performed the best.

### Cooling Method

My initial method revolved around the formula `T = a * T`, where Alpha `a < 1`. I experimented with different `a` values with limited improvements being visible in the results. The logarithmic formula `T = 1/log(step)` was later experimented with, which has shown to improve performance when used in conjunction with the `e^(length o - length 1 / T)` Path Switching formula. 

### Probablistic Path Switching

Probability allows the states to escape a local minima, an issue with the hill climbing algorithm. I have experimented with the three methods as below as my probability function.

	1. Primitive (described in the initial run.)
	2. e^(-lo / T)
	3. e^(lo - l1 / T)

These formulas all grow proportionally to the number of steps incremented already. They grow in an exponential fashion to simulate the temperature of a object cooling. The cooler the object, the less likely we will take the neighbouring tour. With experimentation, I have chosen to go forward with 3. `e^(lo - l1 / T)` as my experiments have shown greater improvements amongst the other two formulae.

------------------------------------------------------------------------

# TourfileB - Genetic Algorithm

<!-- Our genetic algorithm works as follows:

	- A population of size N is generated
	- Children are created from the population using a crossover method
	- The child face a mutation based on probability
	- with N amount of children generated, this will be the new population
	- The best child in the population will be the most favorite tour;
	- repeat for as many generations as liked.
 -->

 My initial implementation worked by initiating a population size of 10,000, 100,000 generations. Each member of the population is a tour, where each tour is randomly generated for the first generation. Cycling through all the generations, two random parents are chosen to crossover using the split method, where half of one parent's tour is merged with half of the other parents tour. Duplicates and missing cities in the offspring are added randomly. Mutation occured depending on probability, where the child tour would have a randomly chosen city's position `N` would be switched with it's `N+1` position. The offspring added to the population for the next generation. Offsprings were kept being created until the population size was met. The best offspring of the generation was kept as the supreme. After all generations were lapped, the supreme from the last generation is used for the tour to be outputted as a file.

The initial implementation produced the following results.

|  Intial | Test | 12 | 17 | 21 | 26 | 42 | 48 | 58 | 175 | 180 | 535 |
|  ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
|  Genetic | 28 | 72 | 2092 | 4243 | 1857 | 2289 | 35412 | 91341 | 44998 | 745530 | 151313 |

## Experimentation

I have chosen to keep the population and generation size unchanged, in order for us to check improvements between the initial implementation and the adjusted. The Mutation method has been chosen to be random 1x, as it performed the best in my testing.

### Generation of Population

Several methods have been tested, such as mutating the cached supreme tour, and greedy. I found issues with the Supreme tour where the success of the algorithm is dependent on the RNG (Random Number Generator) taking the tour out of a possible local minima. 

I started with loading cached data from the results, but this faced issues as the results would tend towards a local maximum. Random generation was used again until I used a best-first greedy algorithm to generate the children. This improved results for most of the tours, but it lacked entropy to escape issues related to escaping more local maximums. Introducing mutation after the greedy tours were produced assisted in escaping the local cap.

#### Choice of Parents (Pre Crossover)

I have attempted two methods of choice for choosing Parents, including my initial random choice and choosing the Supreme (where the best tours will cross over with each other; when a parent has been used to cross over then they cannot be used again). I have found that the random parents have performed better.

### Crossover Methods

Several crossover methods have been tried, but the most successful methods I found were the _Split Method_ and _Partially Mapped Crossover_ (Goldberg & Lingle 1985). I performed tests between the two and found that the split method has shown to be the most effective approach. 

# Utilities for our TSP Methods

In experimentation, both methods are subject to these techniques.

__Supreme Tour Caching__ : In the event that a good tour been discovered, the tour corresponding to its Tourfile is saved locally as a cache in a `.json` file. This supreme tour can be loaded again as a reference file for new results to be compared to. This allows us to keep a good tour on hand, ensuring that we get the best result out of any run.

## Mutation Techniques

__Neighbouring Mutation__ - A neighbouring mutation is produced by finding a random position `N` within the path and switching its position with the city `N+1`. For example, if city `2` was chosen in the tour `1,2,3,4,5,6,7,8`, then the mutation would return `1,3,2,4,5,6,7,8`. If the city chosen is the last city in the list, then it would be replaced with the first city in the list.

__Random Mutation__ - Random mutation is produced by finding two random positions in the path and switching their positions with each other; for example in the tour `1,2,3,4,5,6,7,8`, a Random Number Generator is used to get the cities `2`, and `6`. These two cities are swapped leading to the tour path `1,6,3,4,5,2,7,8`. 

__Partial Shuffle Mutation [1]__ - Integers are swapped randomly between two randomly generated positions. All integers between the first and the second offset are swapped randomly.

The mutation methods were tested against the tours, `AISearchfile042`, `AISearchfile175` and `AISearchfile535`. The test will use the same path switching method, and the results would be the average of 5 Simulated Annealing runs, in order to reduce the significance that entropy applies to the mutation methods.

Overall, the Random Mutation swap with a 1x multiplier performed the best, followed by the Random 2x. The neighbouring 1x performed last. This led to using the Random 1x swap being used in both throughout annealing and genetic algorithms. The case for more mutations detrimentally affecting the performance of the mutation may be related to the fact that the tour would deviate further from its tour direction.

## Path Generation

**Random Generation** - Each member of the population is generated randomly; such that each member has a random sort of a numbers which represent the tours. A tour-length is generated based on this tour. 

__Supreme Mutatation Generation__ - In the event that a supreme tour is saved locally, it is used as a reference 

__Greedy Generation__ - method I have considered is to generate each member of the population by a basic greedy closest neighboring algorithm. This would allow us to ensure that the starting population will start with a relatively good results. It is more computationally expensive to produce, and may result in a local maximum.

__Greedy Generation & Mutation__ - This is similar with the Greedy Mutation, but with the added option of each tour being faced with the possibility of Mutation. This is more computationally expensive to produce than Greedy alone, and also reliant on the Mutation Rate.

Each generation option has their own merits but I have chosen to keep the random generation for Annealing and Greedy Generation & Mutation for the Genetic Algorithm.

# Results

|  Initial | Test | 12 | 17 | 21 | 26 | 42 | 48 | 58 | 175 | 180 | 535 |
|  ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
|  Annealing (i) | 28 | 68 | 2085 | 4255 | 1945 | 2356 | 35469 | 89216 | 45198 | 736040 | 148321 |
|  Genetic (i) | 28 | 72 | 2092 | 4243 | 1857 | 2289 | 35412 | 91341 | 44998 | 745530 | 151313 |
|  Annealing (m) | 28 | 56 | 1521 | 2972 | 1536 | 1343 | 16945 | 34237 | 26399 | 4310 | 70565 |
|  Genetic (m) | 28 | 56 | 1444 | 2676 | 1568 | 1545 | 18588 | 38899 | 22737 | 189123 | 57260 |

I have found that the nearest neighbour approach has dramatically affected the genetic's performance in the 180 Cities tourfile. This may be related to how the tour was set up, where a basic greedy best first approach might not be appropiate in this case.

|  Tours | Test | 12 | 17 | 21 | 26 | 42 | 48 | 58 | 175 | 180 | 535 |
|  ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
|  Annealing | 0 | 17.65 | 27.05 | 30.15 | 21.03 | 43 | 52.23 | 61.62 | 41.59 | 99.41 | 52.42 |
|  Genetic | 0 | 22.22 | 30.98 | 36.93 | 15.56 | 32.5 | 47.51 | 57.41 | 49.47 | 74.63 | 62.16 |

| Tourfile        | Test | 12   | 17   | 21   | 26   | 42   | 48    | 58    | 175   | 180  | 535   |
|-----------------|------|------|------|------|------|------|-------|-------|-------|------|-------|
| Best Tourlength | 28   | 56   | 1444 | 2676 | 1536 | 1343 | 16945 | 34237 | 22737 | 4310 | 57260 |
| Best Performer  | Ann. | Ann. | GA   | GA   | Ann. | Ann. | Ann.  | Ann.  | GA    | Ann. | GA    |


Overall, experimentations on the implementations have shown to assist greatly with the results. 

<!-- Details of your experiences with your implementations and the fine- tuning and experimentation that you undertook in order to try and improve performance. There are [6 marks] available as regards exper- imentation. -->


## References

[1]. Syberfeldt, A., Gustavsson, P., Svantesson, J., Almgren, T. (2014)
"A Case Study of Evolutionary Simulation Based Optimization in Aircraft Engine Manufacturing" In: Industrial Simulation Conference, Skövde, June 11-13, 2014

[2]. Goldberg, D.E., and R. Lingle. “Alleles, Loci, and the Traveling Salesman Problem.”
Proceedings of the First International Conference on Genetic Algorithms and Their Application, edited by Grefenstette J., Lawrence Erlbaum Associates, Hillsdale, NJ, 1985, pp. 154-159.

[3]. S. Kirkpatrick; C. D. Gelatt; M. P. Vecchi (1983). "Optimization by Simulated Annealing", Science, New Series, Vol. 220, No. 4598., pp. 671-680.

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

<!-- | Tour Method  | Multiplier | Tour | Result (Average Tour Length) |
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
| Neighbouring | 2          | 042  | 2132	 					  | -->
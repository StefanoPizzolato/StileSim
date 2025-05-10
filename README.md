# Stile Hackaton - Stefano Pizzolato

This is the repo for my submission for the Interactive Engineer coding challenge at Stile.
The goal was to show a simulation about natural selection and random variation.

## The concept
You control the environment of a population of guppy fish in a lake.
Depending on environmental factors certain guppy fish will be more likely to survive the predators, and other guppies will have a better chance of reproducing.

## Guppies everywhere!
The guppies in the simulation have the following characteristics: **Size**(big or small) and **Color**(bright or dull)
**Size**:
- Big: faster than small guppies, can escape predators more easily, but in high vegetation it's spotted more than small guppies
- Small: slower than big guppies, but it hides better in high vegetation
Size doesn't matter for the chance of mating
**Colour**:
- Dull: have a higher chance of camuflaging in high vegetation, but in low vegetation they are spotted just as easily. They are also less likely to reproduce.
- Bright: have a higher chance of getting spotted in high vegetation, but in low vegetation they are spotted just as easily.
They are more likely to reproduce.

## Controls
The user has control over:
- Number of Predators
- Density of Vegetation
- Starting the turn

## The turn
The turn is divided into:
- **User input**: the user controls the environmental variables
- **Predators**: predators arrive (as many as indicated by the user), and the fish depending on their characteristics survives or not. The number of predators is a multiplier, in the sense that each guppy will have to survive each predator.
- **Mating**: for the sake of simplicity, a guppy will not find a mate, rather it will have a chance or producing another guppy. HERE Random variation can occur, meaning that a small guppy can produce a gib guppy, a dull guppy can produce a bright guppy, and viceversa.

## Some possible questions and goals
- With high vegetation and lots of predators, which guppies do you expect to survive the most?
- If there are no predators around what do you expect to see?
- If you are left with only small dull-coloured guppies and there are no predators, what can you observe after a few turns of mating and why does that happen?




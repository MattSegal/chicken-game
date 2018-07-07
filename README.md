# Chicken Game

Ideas

* fox speeds up over time
* multiple foxes
* end goal to win
* trees mutate / shift
* timer
* death screen

Issues

* fox jumps through trees occasionally
* tree maze is too random

# To do

view layer

- make canvas
- draw trees
- draw fox
- draw chicken
- canvas resize

initialize game state

- pre-populate grid
- locate fox
- locate chicken

create API for the fox

- fox policy is random
- get available actions
- get game board
- get chicken location

provide API for the chicken

- chicken policy is random
- get available actions
- get game board
- get fox location

create fox policy

- random policy
- A* pathing

create chicken policy

- random policy
- policy iteration
- value iteration
- monte carlo
- temporal difference
- TD(lambda)
- player input policy (?) do this last

create visualizations

- chicken value function
- fox value functions

create about page

- about page modal for the entire site
- about page modal for each algorithm

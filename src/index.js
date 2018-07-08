import C from 'constants'

import View from './view'
import GameBoard from './gameboard'
import PlayerActor from './actors/player'
import RandomActor from './actors/random'
// import AStarActor from './actors/a-star'

// Initialize board
const board = new GameBoard()

// Draw grid
View.drawWhenReady(board.grid)

// Create actors
const fox = new RandomActor(C.FOX, board)
const chicken = new RandomActor(C.CHICKEN, board)

// Run the game
board.run()

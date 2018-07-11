import C from 'constants'

import View from './view'
import GameBoard from './gameboard'
import PlayerActor from './actors/player'
import RandomActor from './actors/random'
import AStarActor from './actors/a-star'
import TemporalDifferenceActor from './actors/temporal-difference'

// Initialize board
const board = new GameBoard()

// Draw grid
View.drawWhenReady(board.grid)

// Create actors
const chicken = new TemporalDifferenceActor('chicken', C.CHICKEN, board)
const fox = new AStarActor('fox', C.FOX, board)
fox.addTarget(chicken)
chicken.addTarget(fox)

// Run the game
board.run()

import View from './view'
import GameBoard from './gameboard'
import Controller from './controls'

// Initialize board
const board = new GameBoard()

// Draw grid
View.drawWhenReady(board.grid)

// Hook up controls
new Controller(board)

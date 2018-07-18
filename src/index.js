import React from 'react'
import ReactDOM from 'react-dom'

import View from './view'
import Grid from './grid'
import GameBoard from './gameboard'
import App from './app'

// Initialize board
const baseGrid = new Grid()
// const trainingGrid = baseGrid.copy()
const displayGrid = baseGrid.copy()
const board = new GameBoard(displayGrid._grid)

// Draw grid
View.drawWhenReady(displayGrid._grid)

// Draw controls
ReactDOM.render(<App board={board}/>, document.getElementById('controls'))

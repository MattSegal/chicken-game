import React from 'react'
import ReactDOM from 'react-dom'

import View from './view'
import Grid from './grid'
import OnlineGameBoard from './onlineboard'
import App from './app'

// Initialize board
const baseGrid = new Grid()
const displayGrid = baseGrid.getCopy()
const board = new OnlineGameBoard(displayGrid)

// Draw grid
View.drawWhenReady(board)

// Draw controls
ReactDOM.render(<App board={board} />, document.getElementById('controls'))

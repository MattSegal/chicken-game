import C from 'constants'

import View from './view'


// Initialize grid
const fillCol = () => Math.random() > 0.2 ? C.EMPTY : C.TREE
const fillRow = () => Array(C.BOARD_LENGTH).fill(0).map(fillCol)
const grid = Array(C.BOARD_LENGTH).fill(0).map(fillRow)

// Draw grid
View.onImagesLoaded().then(() => View.drawGrid(grid))


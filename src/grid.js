import C from './constants'

export default class Grid {
  constructor() {
    this._grid = Array(C.BOARD_LENGTH).fill(0).map(fillRow)
  }

  getCopy() {
    return this._grid.map(row => row.map(col => col))
  }
}

const fillCol = () => Math.random() > C.TREE_DENSITY ? C.EMPTY : C.TREE
const fillRow = () => Array(C.BOARD_LENGTH).fill(0).map(fillCol)

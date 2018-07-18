import C from './constants'

export default class Grid {
  constructor(grid=null) {
    if (grid) {
      this._grid = grid
    } else {
      this._grid = Array(C.BOARD_LENGTH).fill(0).map(fillRow)
    }
  }

  copy() {
    const copy = this._grid.map(row => row.map(col => col))
    return new Grid(copy)
  }
}

const fillCol = () => Math.random() > C.TREE_DENSITY ? C.EMPTY : C.TREE
const fillRow = () => Array(C.BOARD_LENGTH).fill(0).map(fillCol)

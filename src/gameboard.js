import C from 'constants'

// Game model singleton
export default class GameBoard {
  constructor() {
    this.reset()
  }

  reset() {
    this.grid = Array(C.BOARD_LENGTH).fill(0).map(row => 
      Array(C.BOARD_LENGTH).fill(0).map(col => Math.random() > 0.2 ? C.EMPTY : C.WALL)
    )
  }

  set(actor) {
    this.grid[actor.row][actor.col] = actor.sprite
  }

  remove(actor) {
    this.grid[actor.row][actor.col] = C.EMPTY
  }

  isValidMove(actor, move) {
    const newRow = actor.row + move[0]
    const newCol = actor.col + move[1]
    return this.isValidPosition(newRow, newCol)
  }

  isValidPosition(row, col) {
    return !(
      row === -1 || row === C.BOARD_LENGTH || // vertical edge
      col === -1 || col === C.BOARD_LENGTH || // horizontal edge
      this.grid[row][col] === C.WALL          // wall collision
    )
  }
}
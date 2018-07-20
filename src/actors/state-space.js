// Build a state space made of 4 variables
// - chicken row (a)
// - chicken column (b)
// - fox row (c)
// - fox column (d)
// initialize each state as an object
// Store these values in nested hash tables, indexed by [a][b][c][d]
import C from '../constants'


export default class StateSpace {
  constructor(initState) {
    this._states = {}
    for (let a = 0; a < C.BOARD_LENGTH; a++) { // chicken row
    for (let b = 0; b < C.BOARD_LENGTH; b++) { // chicken col
    for (let c = 0; c < C.BOARD_LENGTH; c++) { // fox row
    for (let d = 0; d < C.BOARD_LENGTH; d++) { // fox col
      this._states[this.getKey(a, b, c, d)] = initState()
    }}}}
  }

  getState(key) {
    // Return mutable state object
    return this._states[key]
  }

  getStateFromPositions(chickenPos, foxPos) {
    return this.getState(this.getKeyFromPositions(chickenPos, foxPos))
  }

  getKey(a, b, c, d) {
    // Represent a state as an integer 00000000 to 99999999,
    // assume max 99 rows / cols and 2 positions
    return 1000000 * a + 10000 * b + 100 * c + d
  }

  getKeyFromPositions = (chickenPos, foxPos) =>
    this.getKey(chickenPos[0], chickenPos[1], foxPos[0], foxPos[1])
}

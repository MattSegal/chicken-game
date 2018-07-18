// Build a state space made of 4 variables
// - chicken row (a)
// - chicken column (b)
// - fox row (c)
// - fox column (d)
// initialize each state as an object
// Store these values in nested hash tables, indexed by [a][b][c][d]
import C from '../constants'


export default class StateSpace {
  constructor(grid, initState) {
    this.states = {}
    for (let a = 0; a < grid.length; a++) { // chicken row
    for (let b = 0; b < grid.length; b++) { // chicken col
    for (let c = 0; c < grid.length; c++) { // fox row
    for (let d = 0; d < grid.length; d++) { // fox col
      if (grid[a][b] !== C.TREE && grid[c][d] !== C.TREE) {
        this.states[this.getKey(a, b, c, d)] = initState()
      }
    }}}}
  }

  getState(key) {
    // Return mutable state object
    return this.states[key]
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

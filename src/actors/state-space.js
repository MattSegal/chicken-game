// @flow
// Build a state space made of 4 variables
// - chicken row (a)
// - chicken column (b)
// - fox row (c)
// - fox column (d)
// initialize each state as an object
// Store these values in nested hash tables, indexed by [a][b][c][d]
import { BOARD } from '../constants'
import type { Vector } from '../types'

export class StateSpace<T> {
  _states: { [number]: T }
  constructor(initState: () => T) {
    this._states = {}
    for (let a = 0; a < BOARD.BOARD_LENGTH; a++) {
      // chicken row
      for (let b = 0; b < BOARD.BOARD_LENGTH; b++) {
        // chicken col
        for (let c = 0; c < BOARD.BOARD_LENGTH; c++) {
          // fox row
          for (let d = 0; d < BOARD.BOARD_LENGTH; d++) {
            // fox col
            this._states[this.getKey(a, b, c, d)] = initState()
          }
        }
      }
    }
  }
  getState(key: number): T {
    // Return mutable state object
    return this._states[key]
  }
  getStateFromPositions(posA: Vector, posB: Vector): T {
    return this.getState(this.getKeyFromPositions(posA, posB))
  }
  getKey(a: number, b: number, c: number, d: number) {
    // Represent a state as an integer 00000000 to 99999999,
    // assume max 99 rows / cols and 2 positions
    return 1000000 * a + 10000 * b + 100 * c + d
  }
  getKeyFromPositions = (posA: Vector, posB: Vector) =>
    this.getKey(posA[0], posA[1], posB[0], posB[1])
}

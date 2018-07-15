import C from 'constants'
import Actor from './base'


// Uses A* pathing algorithm to find shortest path to the target
// Throw in a random move every 10 steps
export default class AStarActor extends Actor {

  constructor(name, value, board) {
    super(name, value, board)
    this.policySteps = 0

    // Setup a row + col lookup table that scores all moves on the gameboard
    this.squares = {}
    for (let a = 0; a <  C.BOARD_LENGTH; a++) {
      for (let b = 0; b <  C.BOARD_LENGTH; b++) {
        this.squares[keyFromPosition([a, b])] = {}
      }
    }
  }

  timestep() {
    super.timestep()
    this.policySteps += 1
    // Do nothing every 2nd-3rd step
    if (this.policySteps % (3 - Math.floor(Math.random() * 1)) == 0) {
      return
    }

    // Randomly choose next action every 8-10th step
    if (this.policySteps % (10 - Math.floor(Math.random() * 2)) == 0) {
      this.policySteps = 0
      this.randomPolicy()
      return
    }

    // Find shortest path with A* algorithm
    let iterations = 0
    let possible = new Set()
    let seen = new Set()

    let current = keyFromPosition(this.pos)
    const target = keyFromPosition(this.target.pos)
    this.squares[current].steps = 0
    this.squares[current].score = Actor.getManhattanDistance(this.pos, this.target.pos)

    // Find a square with the shortest distance to the target
    while (current !== target) {
      seen.add(current)
      possible.delete(current)

      // Find the new squares reachable from current square
      // and then add them to the set of possible squares
      const currentPos = positionfromKey(current)
      const actions = this.board.getActions(currentPos[0], currentPos[1])
      for (let action of actions) {
        const actionPos = Actor.getNewPosition(action, currentPos)
        const actionKey = keyFromPosition(actionPos)
        if (seen.has(actionKey)) continue
        this.squares[actionKey].steps = this.squares[current].steps + 1
        this.squares[actionKey].score = (
          this.squares[actionKey].steps +
          Actor.getManhattanDistance(actionPos, this.target.pos)
        )
        possible.add(actionKey)
      }

      // Ensure that there are possible moves remaining
      if (possible.size < 1) {
        console.warn('Cannot reach target: ', this.target)
        this.board.reset()
        return
      }

      // Select possible square with the lowest score
      let best = null
      let lowestScore = Number.POSITIVE_INFINITY
      for (let key of possible) {
        if (this.squares[key].score < lowestScore) {
          best = key
          lowestScore = this.squares[key].score
        }
      }
      current = best


      // Break loop if we have done too many iterations
      iterations++
      if (iterations > 5000) {
        console.error('Too many iterations trying to reach square: ', this.target)
        this.board.reset()
        return
      }
    }

    // Backtrack from our current square to find the next move
    while (this.squares[current].steps > 1) {
      let best = null
      let fewestSteps = Number.POSITIVE_INFINITY
      for (let key of seen) {
        const distance = Actor.getManhattanDistance(positionfromKey(current), positionfromKey(key))
        if (distance === 1 && this.squares[key].steps < fewestSteps) {
          best = key
          fewestSteps = this.squares[key].steps
        }
      }
      current = best
    }

    if (current) {
      this.nextAction = Actor.getActionFromPositions(this.pos, positionfromKey(current))
    }
  }

  randomPolicy() {
    const actions = this.getActions()
    const action = actions[Math.floor(Math.random() * actions.length)]
    this.nextAction = action
  }
}


const keyFromPosition = (pos) => pos[0] * 100 + pos[1]
const positionfromKey = (key) => [(key - key % 100) / 100, key % 100]



const sameRow = (sqA, sqB) =>
  sqA.pos[0] === sqB.pos[0]

const sameCol = (sqA, sqB) =>
  sqA.pos[1] === sqB.pos[1]

const samePosition = (sqA, sqB) =>
  sameRow(sqA, sqB) && sameCol(sqA, sqB)


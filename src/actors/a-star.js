import C from 'constants'
import Actor from './base'


// Uses A* pathing algorithm to find shortest path to the target
// Throw in a random move every 10 steps to fuck with the RL algos
export default class AStarActor extends Actor {

  constructor(value, board) {
    super(value, board)
    this.policySteps = 0
  }

  addTarget = target => {
    this.target = target
  }

  randomPolicy = () => {
    const actions = this.getActions()
    const action = actions[Math.floor(Math.random() * actions.length)]
    this.nextAction = action
  }

  runPolicy = () => {
    this.policySteps += 1
    if (this.policySteps > 10) {
      // Randomly choose next action
      this.policySteps = 0
      this.randomPolicy()
      return
    }

    let iterations = 0
    let possible = []
    let seen = []
    let currentSquare = {
      pos: this.pos,
      steps: 0
    }
    currentSquare['score'] = getManhattanDistance(currentSquare, this.target)
    const getNextSquares = getNextSquaresFactory(this.board, seen, this.target)

    // Find a square with the shortest distance to the target
    while (!samePosition(currentSquare, this.target)) {
      // Add current square to list of seen squares
      seen.push(currentSquare)

      // Remove the current square from possible choices
      possible = possible.filter(s => !samePosition(s, currentSquare))

      // Find the new squares reachable from current square
      // and then add them to the list of possible squares
      getNextSquares(currentSquare).forEach(square => possible.push(square))

      if (possible.length < 1) {
        console.error('Cannot reach target: ', this.target)
        this.board.reset()
        return
      }

      // Select possible square with the fewest steps
      currentSquare = possible.reduce(selectFewestSteps)

      // Break loop if we have done too many iterations
      iterations++
      if (iterations > 5000) {
        console.error('Too many iterations trying to reach square: ', this.target)
        this.board.reset()
        return
      }
    }

    // Backtrack from our current square to find the next move
    while (currentSquare.steps > 1) {
      currentSquare = seen
        // Find seen squares that are 1 distance from the current square
        .filter(square => getManhattanDistance(square, currentSquare) === 1)
        // Select the one with the lowest steps
        .reduce(selectFewestSteps)
    }
    if (currentSquare) {
      this.nextAction = chooseAction(this, currentSquare)
    }
  }
}

// Get the 'Manhatten distance' between 2 squares
const getManhattanDistance = (sqA, sqB) =>
  Math.abs(sqA.pos[0] - sqB.pos[0]) + Math.abs(sqA.pos[1] - sqB.pos[1])

// Get next possible unseen squares from the current square
const getNextSquaresFactory = (board, seen, target) => currentSquare =>
  board.getActions(currentSquare.pos[0], currentSquare.pos[1])
  .map(actionsToAdjacentSquares(currentSquare))
  .filter(square => !(seen.some(seenSquare => samePosition(seenSquare, square))))
  .map(square => ({
    pos: square.pos,
    steps: currentSquare.steps + 1,
    score: currentSquare.steps + 1 + getManhattanDistance(square, target)
  }))

const sameRow = (sqA, sqB) =>
  sqA.pos[0] === sqB.pos[0]

const sameCol = (sqA, sqB) =>
  sqA.pos[1] === sqB.pos[1]

const samePosition = (sqA, sqB) =>
  sameRow(sqA, sqB) && sameCol(sqA, sqB)

const selectFewestSteps = (oldSquare, newSquare) =>
  (oldSquare.steps < newSquare.steps) ? oldSquare : newSquare

// Maps an action (NORTH / SOUTH / EAST / WEST)
// into a square that is next to 'square'
const actionsToAdjacentSquares = square => action => ({
  pos: [
    square.pos[0] + C.VECTORS[action][0],
    square.pos[1] + C.VECTORS[action][1],
  ]
})


const chooseAction = (start, chosen) => {
  if (chosen.pos[0] === start.pos[0] + 1 && chosen.pos[1] === start.pos[1]) {
    return C.ACTIONS.SOUTH
  } else if (chosen.pos[0] === start.pos[0] - 1 && chosen.pos[1] === start.pos[1]) {
    return C.ACTIONS.NORTH
  } else if (chosen.pos[0] === start.pos[0] && chosen.pos[1] === start.pos[1] + 1) {
    return C.ACTIONS.EAST
  } else if (chosen.pos[0] === start.pos[0] && chosen.pos[1] === start.pos[1] - 1) {
    return C.ACTIONS.WEST
  }
  return null
}

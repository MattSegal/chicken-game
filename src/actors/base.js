import C from '../constants'

const randomScalar = () => Math.floor(Math.random() * C.BOARD_LENGTH)
const randomPosition = () => [randomScalar(), randomScalar()]


// Represents the chicken/fox on the game board
export default class Actor {
  constructor(name, value, board) {
    this.name = name
    this.value = value
    this.nextAction = null
    this.board = board
    this.reset()
  }

  timestep() {
    // Perform all actions for this timestep
    // To be implemented by child class
  }

  getReward() {
    // Get the reward for this time-step
    return 0
  }

  addTarget = target => {
    this.target = target
  }

  reset() {
    let isEmpty = false
    while (!isEmpty) {
      this.pos = randomPosition()
      if (this.board.grid[this.pos[0]][this.pos[1]] === C.EMPTY) {
        isEmpty = true
      }
    }
    this.board.addActor(this)
  }

  getActions = () => {
    return this.board.getActions(this.pos[0], this.pos[1])
  }

  // Get the 'Manhatten distance' between 2 actors
  static getManhattanDistance(actorA, actorB) {
    return (
      Math.abs(actorA.pos[0] - actorB.pos[0]) +
      Math.abs(actorA.pos[1] - actorB.pos[1])
    )
  }

  // Get new position given a current position and an action
  static getNewPosition(action, oldPosition) {
    return [
      oldPosition[0] + C.VECTORS[action][0],
      oldPosition[1] + C.VECTORS[action][1],
    ]
  }

  // Get action given current position and new position
  static getActionFromPositions(start, end) {
    if (end[0] === start[0] + 1 && end[1] === start[1]) {
      return C.ACTIONS.SOUTH
    } else if (end[0] === start[0] - 1 && end[1] === start[1]) {
      return C.ACTIONS.NORTH
    } else if (end[0] === start[0] && end[1] === start[1] + 1) {
      return C.ACTIONS.EAST
    } else if (end[0] === start[0] && end[1] === start[1] - 1) {
      return C.ACTIONS.WEST
    }
    return null
  }

  static samePosition(posA, posB) {
    return posA[0] == posB[0] && posA[1] == posB[1]
  }
}

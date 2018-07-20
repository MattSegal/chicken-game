import C from '../constants'


// Represents the chicken/fox on the game board
export default class Actor {
  constructor(value) {
    this.type = null
    this.value = value
    this.numGames = 0
  }

  timestep(getActions, resetGame, position, targetPosition) {
    // Perform all actions for this timestep
    // To be implemented by child class
    return null
  }

  // Transform data for transfer to web worker
  serialize() {
    return {
      numGames: this.numGames,
      type: this.type,
    }
  }
  deserialize(data) {
    this.numGames = data.numGames
  }
  reset = () => {
    // Reset any global actor state
    this.numGames = 0
  }

  endGame() {
    // Do whatever you need to at the end of a game
    this.numGames++
  }

  // Get the 'Manhatten distance' between 2 actors
  static getManhattanDistance(posA, posB) {
    return Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1])
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

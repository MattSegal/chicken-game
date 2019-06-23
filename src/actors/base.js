// @flow
import { BOARD, VECTORS, ACTIONS, SPRITES } from '../constants'
import type {
  Sprite,
  Action,
  Vector,
  ActorMessage,
  Grid,
  Actor as ActorType,
  ActorType as ActorTypeType, // I regret nothing
} from '../types'

// Represents the chicken/fox on the game board
export class Actor implements ActorType {
  type: ActorTypeType
  sprite: Sprite
  position: Vector
  gamesPlayed: number
  hasValues = false

  constructor(sprite: Sprite, type: ActorTypeType) {
    this.type = type
    this.sprite = sprite
    this.gamesPlayed = 0
    this.position = [0, 0]
  }

  // Return chosen action for this timestep
  onTimestep(grid: Grid, targetPosition: Vector): Action {
    // To be implemented by child class
    return null
  }

  // Do whatever you need to at the end of a game
  onGameEnd() {
    this.gamesPlayed++
  }

  // Transform data for transfer to web worker
  serialize(): ActorMessage {
    return {
      type: this.type,
      data: {
        gamesPlayed: this.gamesPlayed,
      },
    }
  }

  deserialize(msg: ActorMessage) {
    this.gamesPlayed = msg.data.gamesPlayed
    return this
  }

  getValues(targetPosition: Vector) {
    // Get a grid of values for a given target position
    // normalized from 0 to 1
    return null
  }

  // Get possible actions from the provided gris
  getAvailableActions = (grid: Grid, position: Vector) => {
    const [row, col] = position
    const actions = []
    const max = BOARD.BOARD_LENGTH - 1
    const isNoTree = (r, c) => grid[r][c] !== SPRITES.TREE
    if (row > 0 && isNoTree(row - 1, col)) actions.push(ACTIONS.NORTH)
    if (row < max && isNoTree(row + 1, col)) actions.push(ACTIONS.SOUTH)
    if (col > 0 && isNoTree(row, col - 1)) actions.push(ACTIONS.WEST)
    if (col < max && isNoTree(row, col + 1)) actions.push(ACTIONS.EAST)
    return actions
  }

  // Get the 'Manhatten distance' between 2 actors
  static getManhattanDistance(posA: Vector, posB: Vector) {
    return Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1])
  }

  // Get new position given a current position and an action
  static getNewPosition(action: Action, oldPosition: Vector): Vector {
    if (!action) return oldPosition
    const vector = VECTORS[action]
    return [oldPosition[0] + vector[0], oldPosition[1] + vector[1]]
  }

  // Get action given current position and new position
  static getActionFromPositions(start: Vector, end: Vector) {
    if (end[0] === start[0] + 1 && end[1] === start[1]) {
      return ACTIONS.SOUTH
    } else if (end[0] === start[0] - 1 && end[1] === start[1]) {
      return ACTIONS.NORTH
    } else if (end[0] === start[0] && end[1] === start[1] + 1) {
      return ACTIONS.EAST
    } else if (end[0] === start[0] && end[1] === start[1] - 1) {
      return ACTIONS.WEST
    }
    return null
  }

  static samePosition(posA: Vector, posB: Vector) {
    return posA[0] == posB[0] && posA[1] == posB[1]
  }
}

// @flow
import { VECTORS, ACTIONS } from '../constants'
import type {
  Sprite,
  Action,
  Vector,
  ActorMessage,
  Actor as ActorType,
  ActorType as ActorTypeType, // I regret nothing
} from '../types'

// Represents the chicken/fox on the game board
export class Actor implements ActorType {
  type: ActorTypeType
  sprite: Sprite
  games: number
  position: Vector
  constructor(sprite: Sprite, type: ActorTypeType) {
    this.type = type
    this.sprite = sprite
    this.games = 0
    this.position = [0, 0]
  }

  timestep(
    getActions: (number, number) => Array<Action>,
    resetGame: () => void,
    position: Vector,
    targetPosition: Vector
  ): Action {
    // Perform all actions for this timestep
    // To be implemented by child class
    return null
  }

  // Transform data for transfer to web worker
  serialize(): ActorMessage {
    return {
      games: this.games,
      type: this.type,
    }
  }
  deserialize(msg: ActorMessage) {
    this.games = msg.games
  }
  reset = () => {
    // Reset any global actor state
    this.games = 0
  }

  end() {
    // Do whatever you need to at the end of a game
    this.games++
  }

  getValues(targetPosition: Vector) {
    // Get a grid of values for a given target position
    // normalized from 0 to 1
    return null
  }

  // Get the 'Manhatten distance' between 2 actors
  static getManhattanDistance(posA: Vector, posB: Vector) {
    return Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1])
  }

  // Get new position given a current position and an action
  static getNewPosition(action: Action, oldPosition: Vector) {
    if (!action) return oldPosition
    return [
      oldPosition[0] + VECTORS[action][0],
      oldPosition[1] + VECTORS[action][1],
    ]
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

// @flow
import { BOARD, LOGGING } from '../constants'
import { shuffle } from '../utils'
import { Actor } from './base'
import type {
  Sprite,
  Action,
  Vector,
  ActorMessage,
  Actor as ActorType,
  ActorType as ActorTypeType, // I regret nothing
} from '../types'

type Square = {
  steps: number,
  score: number,
}

// Uses A* pathing algorithm to find shortest path to the target
// Throw in a random move every 10 steps
export default class AStarActor extends Actor {
  squares: { [number]: Square }
  constructor(sprite: Sprite, type: ActorTypeType) {
    super(sprite, type)
    // Setup a row + col lookup table that scores all moves on the gameboard
    this.squares = {}
    for (let a = 0; a < BOARD.BOARD_LENGTH; a++) {
      for (let b = 0; b < BOARD.BOARD_LENGTH; b++) {
        this.squares[getKey([a, b])] = { steps: 0, score: 0 }
      }
    }
  }

  timestep(
    getActions: (number, number) => Array<Action>,
    resetGame: () => void,
    position: Vector,
    targetPosition: Vector
  ): Action {
    // Find shortest path with A* algorithm
    let iterations = 0
    let possible = new Set<number>()
    let seen = new Set<number>()

    let current: number = getKey(position)
    const target = getKey(targetPosition)
    this.squares[current].steps = 0
    this.squares[current].score = Actor.getManhattanDistance(
      position,
      targetPosition
    )

    // Find a square with the shortest distance to the target
    while (current !== target) {
      seen.add(current)
      possible.delete(current)

      // Find the new squares reachable from current square
      // and then add them to the set of possible squares
      const currentPos = positionfromKey(current)
      const actions = getActions(currentPos[0], currentPos[1])
      for (let action of shuffle<Action>(actions)) {
        const actionPos = Actor.getNewPosition(action, currentPos)
        const actionKey = getKey(actionPos)
        if (seen.has(actionKey)) continue
        this.squares[actionKey].steps = this.squares[current].steps + 1
        this.squares[actionKey].score =
          this.squares[actionKey].steps +
          Actor.getManhattanDistance(actionPos, targetPosition)
        possible.add(actionKey)
      }

      // Ensure that there are possible moves remaining
      if (possible.size < 1) {
        LOGGING && console.warn('Cannot reach target: ', targetPosition)
        resetGame()
        return null
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
      current = best || current

      // Break loop if we have done too many iterations
      iterations++
      if (iterations > 5000) {
        LOGGING &&
          console.error(
            'Too many iterations trying to reach square: ',
            targetPosition
          )
        resetGame()
        return null
      }
    }

    // Backtrack from our current square to find the next move
    while (this.squares[current].steps > 1) {
      let best = null
      let fewestSteps = Number.POSITIVE_INFINITY
      for (let key of seen) {
        const distance = Actor.getManhattanDistance(
          positionfromKey(current),
          positionfromKey(key)
        )
        if (distance === 1 && this.squares[key].steps < fewestSteps) {
          best = key
          fewestSteps = this.squares[key].steps
        }
      }
      if (!best) break
      current = best
    }
    if (current) {
      return Actor.getActionFromPositions(position, positionfromKey(current))
    }
    return null
  }
}

const getKey = (pos: Vector): number => pos[0] * 100 + pos[1]
const positionfromKey = (key: number): Vector => [
  (key - (key % 100)) / 100,
  key % 100,
]

const sameRow = (sqA, sqB) => sqA.pos[0] === sqB.pos[0]

const sameCol = (sqA, sqB) => sqA.pos[1] === sqB.pos[1]

const samePosition = (sqA, sqB) => sameRow(sqA, sqB) && sameCol(sqA, sqB)

import C from '../constants'
import Actor from './base'
import { randomChoice } from './utils'

const OPPOSITE = {
  [C.ACTIONS.NORTH]: C.ACTIONS.SOUTH,
  [C.ACTIONS.SOUTH]: C.ACTIONS.NORTH,
  [C.ACTIONS.EAST]: C.ACTIONS.WEST,
  [C.ACTIONS.WEST]: C.ACTIONS.EAST,
}

export default class GreedyActor extends Actor {
  constructor(name, value, board) {
    super(name, value, board)
    this.isFollowing = true
  }

  flee() {
    this.isFollowing = false
    return this
  }

  follow() {
    this.isFollowing = true
    return this
  }

  timestep(getActions, resetGame, position, targetPosition) {
    const row = position[0]
    const col = position[1]
    const targetRow = targetPosition[0]
    const targetCol = targetPosition[1]

    const goUp = this.isFollowing ? row > targetRow : row <= targetRow
    const goDown = this.isFollowing ? row < targetRow : row >= targetRow
    const goRight = this.isFollowing ? col < targetCol : col >= targetCol
    const goLeft = this.isFollowing ? col > targetCol : col <= targetCol

    const actions = getActions(row, col)

    const chosenActions = []

    if (goLeft && actions.includes(C.ACTIONS.WEST))
      chosenActions.push(C.ACTIONS.WEST)
    if (goRight && actions.includes(C.ACTIONS.EAST))
      chosenActions.push(C.ACTIONS.EAST)
    if (goUp && actions.includes(C.ACTIONS.NORTH))
      chosenActions.push(C.ACTIONS.NORTH)
    if (goDown && actions.includes(C.ACTIONS.SOUTH))
      chosenActions.push(C.ACTIONS.SOUTH)

    if (chosenActions.length < 1) {
      return randomChoice(actions)
    } else {
      return randomChoice(chosenActions)
    }
  }
}

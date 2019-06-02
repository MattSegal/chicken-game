// @flow
import { ACTIONS, SPRITES } from '../constants'
import { Actor } from './base'
import { randomChoice } from 'utils'
import type {
  Sprite,
  Action,
  Vector,
  ActorType as ActorTypeType, // I regret nothing
} from 'types'

const OPPOSITE: { [Action]: Action } = {
  N: ACTIONS.SOUTH,
  S: ACTIONS.NORTH,
  E: ACTIONS.WEST,
  W: ACTIONS.EAST,
}

export default class GreedyActor extends Actor {
  isFollowing: boolean
  constructor(sprite: Sprite, type: ActorTypeType) {
    super(sprite, type)
    this.isFollowing = sprite === SPRITES.FOX
  }

  timestep(
    getActions: (number, number) => Array<Action>,
    resetGame: () => void,
    position: Vector,
    targetPosition: Vector
  ): Action {
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

    if (goLeft && actions.includes(ACTIONS.WEST))
      chosenActions.push(ACTIONS.WEST)
    if (goRight && actions.includes(ACTIONS.EAST))
      chosenActions.push(ACTIONS.EAST)
    if (goUp && actions.includes(ACTIONS.NORTH))
      chosenActions.push(ACTIONS.NORTH)
    if (goDown && actions.includes(ACTIONS.SOUTH))
      chosenActions.push(ACTIONS.SOUTH)

    if (chosenActions.length < 1) {
      return randomChoice(actions)
    } else {
      return randomChoice(chosenActions)
    }
  }
}

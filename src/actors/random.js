// @flow
import { Actor } from './base'
import { randomChoice } from 'utils'
import type { Vector, Action } from 'types'

// Totally random actor
export default class RandomActor extends Actor {
  timestep(
    getActions: (number, number) => Array<Action>,
    resetGame: () => void,
    position: Vector,
    targetPosition: Vector
  ): Action {
    return randomChoice(getActions(position[0], position[1]))
  }
}

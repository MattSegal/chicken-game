// @flow
import { Actor } from './base'
import type {
  Sprite,
  Action,
  Vector,
  ActorMessage,
  Actor as ActorType,
  ActorType as ActorTypeType, // I regret nothing
} from 'types'

const MOVES = {
  ArrowDown: 'SOUTH',
  ArrowUp: 'NORTH',
  ArrowLeft: 'WEST',
  ArrowRight: 'EAST',
  s: 'SOUTH',
  w: 'NORTH',
  a: 'WEST',
  d: 'EAST',
}

// Allows player to control the actor
export default class PlayerActor extends Actor {
  chosenNextAction: Action
  constructor(sprite: Sprite, type: ActorTypeType) {
    super(sprite, type)
    this.chosenNextAction = null
    // @noflow
    document.addEventListener('keydown', this.onKeyDown)
  }

  onKeyDown = (e: SyntheticKeyboardEvent<any>) => {
    this.chosenNextAction = MOVES[e.key] || null
  }

  timestep(
    getActions: (number, number) => Array<Action>,
    resetGame: () => void,
    position: Vector,
    targetPosition: Vector
  ): Action {
    let nextAction = null
    if (getActions(position[0], position[1]).includes(this.chosenNextAction)) {
      nextAction = this.chosenNextAction
      this.chosenNextAction = null
    }
    return nextAction
  }
}

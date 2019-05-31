// @flow
import { Actor } from './base'
import type {
  Sprite,
  Action,
  Vector,
  ActorMessage,
  Actor as ActorType,
  Grid,
  ActorType as ActorTypeType, // I regret nothing
} from '../types'

const MOVES: { [string]: Action } = {
  ArrowDown: 'S',
  ArrowUp: 'N',
  ArrowLeft: 'W',
  ArrowRight: 'E',
  s: 'S',
  w: 'N',
  a: 'W',
  d: 'E',
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

  onTimestep(grid: Grid, targetPosition: Vector): Action {
    const actions = this.getAvailableActions(grid, this.position)
    let nextAction = null
    if (actions.includes(this.chosenNextAction)) {
      nextAction = this.chosenNextAction
      this.chosenNextAction = null
    }
    return nextAction
  }
}

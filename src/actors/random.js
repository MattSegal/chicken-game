// @flow
import { Actor } from './base'
import { randomChoice } from '../utils'
import type { Vector, Action, Grid } from '../types'

// Totally random actor
export default class RandomActor extends Actor {
  onTimestep(grid: Grid, targetPosition: Vector): Action {
    const actions = this.getAvailableActions(grid, this.position)
    return randomChoice(actions)
  }
}

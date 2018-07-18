import Actor from './base'
import { randomChoice } from './utils'

// Totally random actor
export default class RandomActor extends Actor {
  timestep(getActions, resetGame, position, targetPosition) {
    return randomChoice(getActions(position[0], position[1]))
  }
}

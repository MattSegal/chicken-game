import Actor from './base'
import { randomChoice } from './utils'

// Totally random actor
export default class RandomActor extends Actor {
  timestep() {
    super.timestep()
    this.nextAction = randomChoice(this.getActions())
  }
}

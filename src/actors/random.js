import Actor from './base'

// Totally random actor
export default class RandomActor extends Actor {
  timestep() {
    super.timestep()
    const actions = this.getActions()
    const action = actions[Math.floor(Math.random() * actions.length)]
    this.nextAction = action
  }
}

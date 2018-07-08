import Actor from './base'

// Totally random actor
export default class RandomActor extends Actor {
  runPolicy = () => {
    const actions = this.getActions()
    const action = actions[Math.floor(Math.random() * actions.length)]
    this.nextAction = action
  }
}

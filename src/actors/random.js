import Actor from './base'

// Totally random actor
export default class RandomActor extends Actor {
  constructor(value, board) {
    super(value, board)
    this.reward = 0
  }

  reset() {
    super.reset()
    console.log(this.reward)
    this.reward = 0
  }

  addTarget = target => {
    this.target = target
  }

  runPolicy = () => {
    this.reward += getManhattanDistance(this, this.target) - 3
    if (this.reward % 100 == 0) {
      console.log(this.reward)
    }

    const actions = this.getActions()
    const action = actions[Math.floor(Math.random() * actions.length)]
    this.nextAction = action
  }
}

// Get the 'Manhatten distance' between 2 actors
const getManhattanDistance = (actorA, actorB) =>
  Math.abs(actorA.pos[0] - actorB.pos[0]) + Math.abs(actorA.pos[1] - actorB.pos[1])

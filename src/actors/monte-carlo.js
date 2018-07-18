import C from '../constants'
import Actor from './base'
import StateSpace from './state-space'

const ALPHA = 0.9

export default class MonteCarloActor extends Actor {

  constructor(name, value, board) {
    super(name, value, board)
    this.isFleeing = true
    this.episodeReward = 0
    this.states = new StateSpace(this.board.grid, () => ({
      value: 0,
      visits: 0
    }))
    this.seen = new Set()
  }

  flee() {
    this.isFleeing = true
    return this
  }

  follow() {
    this.isFleeing = false
    return this
  }

  getReward() {
    const distance = Actor.getManhattanDistance(this.pos, this.target.pos)
    if (this.isFleeing) {
      // Encourage a fleer to keep away
      return distance < 5 ? -1 : 1
    } else {
      // Encourage a follower to close the distance
      return -1 * distance
    }
  }

  reset() {
    super.reset()
    if (!this.seen) return
    // Update our value function with information from this episode
    for (let seenKey of this.seen) {
      const state = this.states.getState(seenKey)
      const error = this.episodeReward - state.value
      state.value += (ALPHA / state.visits) * error
    }
    // Reset our reward and seen states
    this.episodeReward = 0
    this.seen = new Set()
  }

  timestep() {
    // Perform all actions for this timestep
    super.timestep()

    // Record the reward we got for this timestep
    this.episodeReward += this.getReward()
    // Record our visit to this state
    const lookupKey = this.states.getKeyFromPositions(this.pos, this.target.pos)
    this.seen.add(lookupKey)
    const currentState = this.states.getState(lookupKey)
    currentState.visits += 1

    // Using the current value function, greedily choose where we're going to go next
    let bestAction = null
    let bestValue = Number.NEGATIVE_INFINITY
    let newPosition = this.pos

    // Evaluate all possible actions
    const actions = this.getActions()
    actions.push(null) // Give the actor the option of not moving
    for (let action of actions) {
      // Find the actor's new position given the action
      let actionPosition
      if (action) {
        actionPosition = Actor.getNewPosition(action, this.pos)
      } else {
        actionPosition = this.pos
      }

      // If this new action is more valuable than our best option, choose that
      const nextState = this.states.getStateFromPositions(actionPosition, this.target.pos)
      if (nextState.value > bestValue) {
        bestValue = nextState.value
        bestAction = action
        newPosition = actionPosition
      }
    }

    // Perform the best known action
    this.nextAction = bestAction
  }
}



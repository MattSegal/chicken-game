import C from '../constants'
import Actor from './base'
import StateSpace from './state-space'

const ALPHA = 0.9

export default class MonteCarloActor extends Actor {

  constructor(value) {
    super(value)
    this.isFleeing = true
    this.episodeReward = 0
    this.states = new StateSpace(() => ({
      value: 0.1 * Math.random(),
      visits: 0
    }))
    this.seen = new Set()
  }

  serialize() {
    return {
      numGames: this.numGames,
      type: this.type,
      states: this.states._states,
    }
  }
  deserialize(data) {
    console.log(data)
    this.numGames = data.numGames
    this.states._states = data.states
  }
  reset = () => {
    // Reset any global actor state
    this.numGames = 0
    this.states = new StateSpace(() => ({
      value: 0.1 * Math.random(),
      visits: 0
    }))
  }


  flee() {
    this.isFleeing = true
    return this
  }

  follow() {
    this.isFleeing = false
    return this
  }

  getReward(distance) {
    if (this.isFleeing) {
      // Encourage a fleer to keep away
      return distance < 5 ? -1 : 1
    } else {
      // Encourage a follower to close the distance
      return -1 * distance
    }
  }

  endGame() {
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

  timestep(getActions, resetGame, position, targetPosition) {
    // Record the reward we got for this timestep
    const distance = Actor.getManhattanDistance(position, targetPosition)
    this.episodeReward += this.getReward(distance)
    // Record our visit to this state
    const lookupKey = this.states.getKeyFromPositions(position, targetPosition)
    this.seen.add(lookupKey)
    const currentState = this.states.getState(lookupKey)
    currentState.visits += 1

    // Using the current value function, greedily choose where we're going to go next
    let bestAction = null
    let bestValue = Number.NEGATIVE_INFINITY
    let newPosition = position

    // Evaluate all possible actions
    const actions = getActions(position[0], position[1])
    actions.push(null) // Give the actor the option of not moving
    for (let action of actions) {
      // Find the actor's new position given the action
      let actionPosition
      if (action) {
        actionPosition = Actor.getNewPosition(action, position)
      } else {
        actionPosition = position
      }

      // If this new action is more valuable than our best option, choose that
      const nextState = this.states.getStateFromPositions(actionPosition, targetPosition)
      if (nextState.value > bestValue) {
        bestValue = nextState.value
        bestAction = action
        newPosition = actionPosition
      }
    }

    // Perform the best known action
    return bestAction
  }
}



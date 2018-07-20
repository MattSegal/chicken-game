import C from '../constants'
import Actor from './base'
import StateSpace from './state-space'

const ALPHA = 0.9
const GAMMA = 0.9

export default class TemporalDifferenceActor extends Actor {

  constructor(value) {
    super(value)
    this.isFleeing = true
    this.states = new StateSpace(() => ({ value: 0.1 * Math.random() }))
  }

  // Transform data for transfer to web worker
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
    this.states = new StateSpace(() => ({ value: 0.1 * Math.random() }))
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

  timestep(getActions, resetGame, position, targetPosition) {
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
      const actionValue = this.states.getStateFromPositions(actionPosition, targetPosition).value
      if (actionValue > bestValue) {
        bestValue = actionValue
        bestAction = action
        newPosition = actionPosition
      }
    }

    // Using the expected value of our next move, update the value function
    // with the temporal difference algorithm
    const distance = Actor.getManhattanDistance(position, targetPosition)
    const reward = this.getReward(distance)
    const currentValue = this.states.getStateFromPositions(position, targetPosition).value
    const expectedValue = this.states.getStateFromPositions(newPosition, targetPosition).value
    const targetValue = reward + GAMMA * expectedValue
    const error = targetValue - currentValue
    const newValue = currentValue + ALPHA * error
    const currentState = this.states.getStateFromPositions(position, targetPosition)
    currentState.value = newValue

    // Perform the best known action
    return bestAction
  }
}



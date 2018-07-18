import C from '../constants'
import Actor from './base'
import StateSpace from './state-space'

const ALPHA = 0.9
const GAMMA = 0.9

export default class TemporalDifferenceActor extends Actor {

  constructor(name, value, board) {
    super(name, value, board)
    this.isFleeing = true
    this.states = new StateSpace(this.board.grid, () => ({ value: 0 }))
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

  timestep() {
    // Perform all actions for this timestep
    super.timestep()

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
      const actionValue = this.getValue(actionPosition)
      if (actionValue > bestValue) {
        bestValue = actionValue
        bestAction = action
        newPosition = actionPosition
      }
    }

    // Perform the best known action
    this.nextAction = bestAction

    // Using the expected value of our next move, update the value function
    // with the temporal difference algorithm
    const reward = this.getReward()
    const currentValue = this.getValue(this.pos)
    const expectedValue = this.getValue(newPosition)
    const targetValue = reward + GAMMA * expectedValue
    const error = targetValue - currentValue
    const newValue = currentValue + ALPHA * error
    this.setValue(newValue)
  }

  // Get the value of the state with target position and 'pos'
  getValue = pos => this.states.getStateFromPositions(pos, this.target.pos).value

  // Set the value of the state with target position and current actor position
  setValue = val => {
    const state = this.states.getStateFromPositions(this.pos, this.target.pos)
    state.value = val
  }
}



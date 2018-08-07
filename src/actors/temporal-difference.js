import C from '../constants'
import Actor from './base'
import StateSpace from './state-space'
import { randomChoice } from './utils'

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

  getValues(targetPosition) {
    const arr = []
    const ranking = []
    // Get a grid of values for a given target position
    // normalized from 0 to 1
    for (let a = 0; a < C.BOARD_LENGTH; a++) { // actor row
    for (let b = 0; b < C.BOARD_LENGTH; b++) { // actor col
      if (!arr[a]) arr[a] = []
      const key = this.states.getKey(a, b, targetPosition[0], targetPosition[1]) 
      const val = this.states.getState(key).value
      arr[a].push(val)
      ranking.push(val)
    }}
    // Normalize results to range [0,1]
    ranking.sort((a,b) => a > b)
    for (let a = 0; a < C.BOARD_LENGTH; a++) { // actor row
    for (let b = 0; b < C.BOARD_LENGTH; b++) { // actor col
      arr[a][b] = ranking.indexOf(arr[a][b]) / (ranking.length - 1)
    }}
    return arr
  }


  getReward(distance) {
    if (this.isFleeing) {
      // Encourage a fleer to keep away
      if (distance == 1) {
        return -1000
      } else {
        return 0      
      }
    } else {
      // Encourage a follower to close the distance
      if (distance == 1) {
        return 1000
      } else {
        return 0      
      }
    }
  }

  timestep(getActions, resetGame, position, targetPosition) {
    // Evaluate all possible actions
    const actions = getActions(position[0], position[1])
    actions.push(null) // Give the actor the option of not moving

    // We're using e-greedy policy improvement strategy
    // There is an epsilon chance of randomly picking our next move
    const epsilon = 1 / Math.sqrt(this.numGames)
    let chosenAction
    if (Math.random() < epsilon) {
      chosenAction = this.chooseActionRandomly(actions)
    } else {
      chosenAction = this.chooseActionGreedily(actions, position, targetPosition)
    }
    const newPosition = Actor.getNewPosition(chosenAction, position)

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

    return chosenAction
  }

  chooseActionRandomly(actions) {
    return randomChoice(actions)
  }

  chooseActionGreedily(actions, position, targetPosition) {
    // Using the current value function, greedily choose where we're going to go next
    let bestAction = null
    let bestValue = Number.NEGATIVE_INFINITY
    let newPosition = position

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
    return bestAction
  }
}



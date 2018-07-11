import C from '../constants'
import Actor from './base'

const ALPHA = 1
const GAMMA = 1

export default class TemporalDifferenceActor extends Actor {

  constructor(name, value, board) {
    super(name, value, board)
    this.values = {}
    const grid = this.board.grid
    // Initialize value of all states to 0
    for (let a = 0; a < grid.length; a++) {  // chicken row
      for (let b = 0; b < grid.length; b++) { // chicken col
        for (let c = 0; c < grid.length; c++) { // fox row
          for (let d = 0; d < grid.length; d++) { // fox col
            if (grid[a][b] !== C.TREE && grid[c][d] !== C.TREE) {
              if (typeof(this.values[a]) === 'undefined') {
                this.values[a] = {}
              }
              if (typeof(this.values[a][b]) === 'undefined') {
                this.values[a][b] = {}
              }
              if (typeof(this.values[a][b][c]) === 'undefined') {
                this.values[a][b][c] = {}
              }
              this.values[a][b][c][d] = Math.random() / 10
            }
          }
        }
      }
    }
  }

  getReward() {
    // Reward the chicken for surviving, and punish it for being too close
    const distance = Actor.getManhattanDistance(this, this.target)
    if (distance < 4) {
      return -1
    } else {
      return 1
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
  getValue = pos => this.values[pos[0]][pos[1]][this.target.pos[0]][this.target.pos[1]]

  // Set the value of the state with target position and current actor position
  setValue = val => {
    this.values[this.pos[0]][this.pos[1]][this.target.pos[0]][this.target.pos[1]] = val
  }
}



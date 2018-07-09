import C from '../constants'
import Actor from './base'

const ALPHA = 0.9
const GAMMA = 0.9

export default class TemporalDifferenceActor extends Actor {

  constructor(value, board) {
    super(value, board)
    this.values = {}
    this.reward = 0
    const grid = this.board.grid
    // Initialize value of all states to 0
    for (let a = 0; a < grid.length; a++) {
      for (let b = 0; b < grid.length; b++) {
        for (let c = 0; c < grid.length; c++) {
          for (let d = 0; d < grid.length; d++) {
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

  reset() {
    super.reset()
    console.log(this.reward)
    this.reward = 0
  }

  addTarget = target => {
    this.target = target
  }

  runPolicy = () => {
    // Reward the chicken for being far away from the fox
    // and push it for being too close
    this.reward += getManhattanDistance(this, this.target) - 3

    if (this.reward % 100 == 0) {
      console.log(this.reward)
    }

    // Using the current value function, greedily choose where we're going to go next
    const actions = this.getActions()
    actions.push(null) // Give the actor the option of not moving
    let bestAction = null
    let bestValue = Number.NEGATIVE_INFINITY
    let newPosition = this.pos
    for (let action of actions) {
      let actionPosition
      if (action) {
        actionPosition = [
          this.pos[0] + C.VECTORS[action][0],
          this.pos[1] + C.VECTORS[action][1],
        ]
      } else {
        actionPosition = this.pos
      }
      const actionValue = this.getValue(actionPosition)

      if (actionValue > bestValue) {
        bestValue = actionValue
        bestAction = action
        newPosition = actionPosition
      }
    }
    this.nextAction = bestAction

    // Using the expected value of our next move, update the value function
    // with the temporal difference algorithm
    const currentValue = this.getValue(this.pos)
    const expectedValue = this.getValue(newPosition)
    const targetValue = this.reward + GAMMA * expectedValue
    const error = targetValue - currentValue
    const newValue = currentValue + ALPHA * error
    this.setValue(newValue)
  }

  getValue = pos => this.values[pos[0]][pos[1]][this.target.pos[0]][this.target.pos[1]]
  setValue = val => {
    this.values[this.pos[0]][this.pos[1]][this.target.pos[0]][this.target.pos[1]] = val
  }
}


// Get the 'Manhatten distance' between 2 actors
const getManhattanDistance = (actorA, actorB) =>
  Math.abs(actorA.pos[0] - actorB.pos[0]) + Math.abs(actorA.pos[1] - actorB.pos[1])

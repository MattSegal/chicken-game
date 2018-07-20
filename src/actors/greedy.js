import C from '../constants'
import Actor from './base'
import { randomChoice } from './utils'

const OPPOSITE = {
  [C.ACTIONS.NORTH]: C.ACTIONS.SOUTH,
  [C.ACTIONS.SOUTH]: C.ACTIONS.NORTH,
  [C.ACTIONS.EAST]: C.ACTIONS.WEST,
  [C.ACTIONS.WEST]: C.ACTIONS.EAST,
}


export default class GreedyActor extends Actor {

  constructor(name, value, board) {
    super(name, value, board)
    this.isFollowing = true
  }

  flee() {
    this.isFollowing = false
    return this
  }

  follow() {
    this.isFollowing = true
    return this
  }

  timestep(getActions, resetGame, position, targetPosition) {
    const row = position[0]
    const col = position[1]
    const targetRow = targetPosition[0]
    const targetCol = targetPosition[1]

    const actions = getActions(row, col)
    const seen = new Set()

    let chosenAction = null
    let iter = 0
    while (!chosenAction) {
      iter++
      if (iter > 100) {
        console.warn('GreedyActor is too tired to continue.')
        resetGame()
        return
      }
      const action = randomChoice(actions)
      const chooseGreedily = (
        (action === C.ACTIONS.NORTH && row > targetRow) ||
        (action === C.ACTIONS.SOUTH && row < targetRow) ||
        (action === C.ACTIONS.EAST && col < targetCol) ||
        (action === C.ACTIONS.WEST && col > targetCol)
      )
      if (chooseGreedily) {
        if (this.isFollowing) {
          chosenAction = action
        } else if (actions.includes(OPPOSITE[action])) {
          chosenAction = OPPOSITE[action]
        }
      }
      seen.add(action)
      if (seen.size >= actions.length) {
        // Choose a random action if there are no greedy options
        chosenAction = action
      }
    }
    return chosenAction
  }
}

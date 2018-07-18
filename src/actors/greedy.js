import C from 'constants'
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

  timestep() {
    super.timestep()
    const row = this.pos[0]
    const col = this.pos[1]
    const targetRow = this.target.pos[0]
    const targetCol = this.target.pos[1]

    const actions = this.board.getActions(row, col)
    const seen = new Set()

    let chosenAction = null
    let iter = 0
    while (!chosenAction) {
      iter++
      if (iter > 100) {
        console.warn('GreedyActor is too tired to continue.')
        this.board.reset()
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
    this.nextAction = chosenAction
  }
}

import Actor from './base'

const MOVES = {
  ArrowDown: 'SOUTH',
  ArrowUp: 'NORTH',
  ArrowLeft: 'WEST',
  ArrowRight: 'EAST',
  s: 'SOUTH',
  w: 'NORTH',
  a: 'WEST',
  d: 'EAST',
}

// Allows player to control the actor
export default class PlayerActor extends Actor {

  constructor(value, board) {
    super(value, board)
    document.addEventListener('keydown', e => {
      const nextAction = MOVES[e.key] || null
      const actions = this.getActions()
      if (actions.includes(nextAction)) {
        this.nextAction = nextAction
      }
    })
  }

  runPolicy = () => {
    // Do nothing
  }
}

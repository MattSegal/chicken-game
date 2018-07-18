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

  constructor(value) {
    super(value)
    this.chosenNextAction = null
    document.addEventListener('keydown', e => {
      this.chosenNextAction = MOVES[e.key] || null
    })
  }

  timestep(getActions, resetGame, position, targetPosition) {
    let nextAction = null
    if (getActions(position[0], position[1]).includes(this.chosenNextAction)) {
      nextAction = this.chosenNextAction
      this.chosenNextAction = null
    }
    return nextAction
  }
}

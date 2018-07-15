import C from 'constants'
import Actor from './base'


// Runs in the direction of the chicken
export default class AStarActor extends Actor {

  timestep() {
    super.timestep()
    const row = this.pos[0]
    const col = this.pos[1]
    const actions = this.board.getActions(row, col)

    // TODO


    for (let action of actions) {
    }
  }
}

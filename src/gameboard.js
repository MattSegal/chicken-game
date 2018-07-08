import C from 'constants'


const fillCol = () => Math.random() > 0.2 ? C.EMPTY : C.TREE
const fillRow = () => Array(C.BOARD_LENGTH).fill(0).map(fillCol)


// Game model singleton
export default class GameBoard {
  constructor() {
    this.reset()
    this.actors = []
  }

  reset = () => {
    this.grid = Array(C.BOARD_LENGTH).fill(0).map(fillRow)
    // TODO: Add all actors to the board
  }

  addActor = (actor) => {
    this.actors.push(actor)
    this.setActorPosition(actor)
  }

  moveActors = () => {
    for (let actor of this.actors) {
      actor.runPolicy()
      const action = actor.nextAction
      actor.nextAction = null
      if (action) {
        this.clearPosition(actor.pos)
        actor.pos[0] += C.VECTORS[action][0]
        actor.pos[1] += C.VECTORS[action][1]
        this.setActorPosition(actor)
      }
    }
  }

  setActorPosition = (actor) => {
    this.grid[actor.pos[0]][actor.pos[1]] = actor.value
  }

  clearPosition = (pos) => {
    this.grid[pos[0]][pos[1]] = C.EMPTY
  }

  getActions = (row, col) => {
    const actions = []
    const max = C.BOARD_LENGTH - 1
    if (row < 0 || col < 0 || col > max || row > max ) return actions
    row > 0 && this.grid[row - 1][col] !== C.TREE && actions.push(C.ACTIONS.NORTH)
    row < max  && this.grid[row + 1][col] !== C.TREE && actions.push(C.ACTIONS.SOUTH)
    col > 0 && this.grid[row][col - 1] !== C.TREE && actions.push(C.ACTIONS.WEST)
    col < max && this.grid[row][col + 1] !== C.TREE && actions.push(C.ACTIONS.EAST)
    return actions
  }

  run = () => {
    this.moveActors()
    // TODO: Add win condition
    setTimeout(this.run, C.TICK)
  }
}

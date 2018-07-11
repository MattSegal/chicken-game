import C from 'constants'


const fillCol = () => Math.random() > 0.2 ? C.EMPTY : C.TREE
const fillRow = () => Array(C.BOARD_LENGTH).fill(0).map(fillCol)


// Game model singleton
export default class GameBoard {
  constructor() {
    this.actors = []
    this.setupGrid()
    this.timerId = null
  }

  setupGrid = () => {
    this.grid = Array(C.BOARD_LENGTH).fill(0).map(fillRow)
  }

  reset = () => {
    clearInterval(this.timerId)
    for (let actor of this.actors) {
      this.grid[actor.pos[0]][actor.pos[1]] = C.EMPTY
      actor.reset()
      this.setActorPosition(actor)
    }
    this.run()
  }

  addActor = (actor) => {
    if (!this.actors.includes(actor)) {
      this.actors.push(actor)
      this.setActorPosition(actor)
    }
  }

  moveActors = () => {
    for (let actor of this.actors) {
      actor.timestep()
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
    this.timerId = setInterval(() => {
      this.moveActors()
      if (samePosition(this.actors[0], this.actors[1])) {
        // Game over
        this.reset()
      }
    }, C.TICK)
  }
}

const sameRow = (sqA, sqB) =>
  sqA.pos[0] === sqB.pos[0]

const sameCol = (sqA, sqB) =>
  sqA.pos[1] === sqB.pos[1]

const samePosition = (sqA, sqB) =>
  sameRow(sqA, sqB) && sameCol(sqA, sqB)

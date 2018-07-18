import C from 'constants'


const fillCol = () => Math.random() > C.TREE_DENSITY ? C.EMPTY : C.TREE
const fillRow = () => Array(C.BOARD_LENGTH).fill(0).map(fillCol)


// Game model singleton
export default class GameBoard {
  constructor() {
    this.fox = null
    this.chicken = null
    this.setupGrid()
    this.timerId = null
    this.numGames = 0
    this.gameIterations = 0
  }

  setupGrid = () => {
    this.grid = Array(C.BOARD_LENGTH).fill(0).map(fillRow)
  }

  addFox = actor => {
    if (this.fox) {
      this.clearPosition(this.fox.pos)
    }
    this.fox = actor
    this.setActorPosition(actor)
    if (this.fox && this.chicken) {
      this.fox.setTarget(this.chicken)
      this.chicken.setTarget(this.fox)
    }
  }

  addChicken = actor => {
    if (this.chicken) {
      this.clearPosition(this.chicken.pos)
    }
    this.chicken = actor
    this.setActorPosition(actor)
    if (this.fox && this.chicken) {
      this.fox.setTarget(this.chicken)
      this.chicken.setTarget(this.fox)
    }
  }

  moveActors = () => {
    for (let actor of [this.fox, this.chicken]) {
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

  runInterval = () => {
    this.timerId = setInterval(() => this.run(this.resetInterval), C.TICK)
  }

  resetInterval = () => {
    clearInterval(this.timerId)
    setTimeout(() => {
      this.reset()
      this.runInterval()
    }, 3 * C.TICK)
  }

  runIters = (iters) => {
    clearInterval(this.timerId)
    for (let i = 0; i < iters; i++) {
      this.run(this.reset)
    }
  }

  reset = () => {
    for (let actor of [this.fox, this.chicken]) {
      this.grid[actor.pos[0]][actor.pos[1]] = C.EMPTY
      actor.reset()
      this.setActorPosition(actor)
    }
  }

  run = reset => {
    this.gameIterations++
    this.moveActors()
    const shoudlReset = (
      this.gameIterations >= C.MAX_EPISODE_LENGTH ||
      distance(this.fox, this.chicken) < 2
    )
    if (shoudlReset) {
      // Game over
      this.gameIterations = 0
      reset()
      this.numGames++
    }
  }
}

const sameRow = (sqA, sqB) =>
  sqA.pos[0] === sqB.pos[0]

const sameCol = (sqA, sqB) =>
  sqA.pos[1] === sqB.pos[1]

const samePosition = (sqA, sqB) =>
  sameRow(sqA, sqB) && sameCol(sqA, sqB)


const distance = (sqA, sqB) =>
  Math.abs(sqA.pos[0] - sqB.pos[0]) + Math.abs(sqA.pos[1] - sqB.pos[1])

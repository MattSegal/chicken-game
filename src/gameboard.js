import C from './constants'


// Game model
export default class GameBoard {
  constructor(grid) {
    this.grid = grid

    this.foxActor = null
    this.chickenActor = null
    this.foxPosition = this.getRandomPosition()
    this.chickenPosition = this.getRandomPosition()

    this.timerId = null
    this.isTraining = false
    this.gameIterations = 0
  }

  addFox = actor => {
    this.foxActor = actor
    this.setActorPosition(this.foxActor, this.foxPosition)
  }

  addChicken = actor => {
    this.chickenActor = actor
    this.setActorPosition(this.chickenActor, this.chickenPosition)
  }

  setActorPosition = (actor, position) => {
    this.grid[position[0]][position[1]] = actor.value
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

  getRandomPosition = () => {
    while (true) {
      const position = [randomScalar(), randomScalar()]
      if (this.grid[position[0]][position[1]] === C.EMPTY) {
        return position
      }
    }
  }

  reset = () => {
    this.foxActor.endGame()
    this.chickenActor.endGame()

    this.clearPosition(this.foxPosition)
    this.clearPosition(this.chickenPosition)

    this.foxPosition = this.getRandomPosition()
    this.chickenPosition = this.getRandomPosition()

    this.setActorPosition(this.foxActor, this.foxPosition)
    this.setActorPosition(this.chickenActor, this.chickenPosition)
  }

  run = reset => {
    if (!this.foxActor || !this.chickenActor) return
    this.gameIterations++

    const previousFoxPosition = [this.foxPosition[0], this.foxPosition[1]]
    const foxAction = this.foxActor.timestep(this.getActions, reset, this.foxPosition, this.chickenPosition)
    this.move(this.foxActor, this.foxPosition, foxAction)

    const chickenAction = this.chickenActor.timestep(this.getActions, reset, this.chickenPosition, previousFoxPosition)
    this.move(this.chickenActor, this.chickenPosition, chickenAction)

    const shouldReset = (
      this.gameIterations >= C.MAX_EPISODE_LENGTH ||
      distance(this.foxPosition, this.chickenPosition) < 2
    )
    if (shouldReset) {
      // Game over
      this.gameIterations = 0
      reset()
    }
  }

  move = (actor, position, action) => {
    if (!action) return
    this.clearPosition(position)
    position[0] += C.VECTORS[action][0]
    position[1] += C.VECTORS[action][1]
    this.setActorPosition(actor, position)
  }
}

const samePosition = (posA, posB) =>
  (posA[0] === posB[0]) && (posA[1] === posB[1])

const distance = (posA, posB) =>
  Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1])

const randomScalar = () => Math.floor(Math.random() * C.BOARD_LENGTH)

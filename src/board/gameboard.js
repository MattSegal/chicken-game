// @flow
import { SPRITES, BOARD, ACTIONS, VECTORS, TIME } from 'constants'
import type {
  Actor,
  Vector,
  Grid,
  Action,
  GameBoard as GameBoardType,
} from 'types'

// Game model
export class GameBoard implements GameBoardType {
  grid: Grid
  heroIdx: 0 | 1 | null
  actors: [Actor, Actor]
  gameIterations: number
  constructor(grid: Grid, actors: [Actor, Actor], heroIdx: 0 | 1 | null) {
    this.grid = grid
    this.gameIterations = 0
    this.actors = actors
    this.heroIdx = heroIdx
    for (let actor of this.actors) {
      const startPosition = this._getRandomPosition()
      actor.position = startPosition
      this._setPosition(actor)
    }
  }

  getValues = () => {
    if (!this.heroIdx) return null
    const hero = this.actors[this.heroIdx]
    const villain = this.actors[1 - this.heroIdx]
    return hero.getValues(villain.position)
  }

  reset = () => {
    for (let actor of this.actors) {
      actor.endGame()
      this._clearPosition(actor.position)
      actor.position = this._getRandomPosition()
      this._setPosition(actor)
    }
  }

  run = onReset => this._run(onReset)

  _run = (onReset: () => void) => {
    this.gameIterations++
    let prevPosition = null
    for (let [idx, actor] of this.actors.entries()) {
      const opponentPosition = prevPosition
        ? prevPosition
        : this.actors[1].position
      const action = actor.timestep(
        this._getActions,
        onReset,
        actor.position,
        opponentPosition
      )
      prevPosition = actor.position
      this._move(actor, action)
    }

    const shouldReset =
      this.gameIterations >= TIME.MAX_EPISODE_LENGTH ||
      distance(this.actors[0].position, this.actors[1].position) < 2
    if (shouldReset) {
      // Game over
      this.gameIterations = 0
      onReset()
    }
  }

  _move = (actor: Actor, action: Action) => {
    if (!action) return
    this._clearPosition(actor.position)
    actor.position[0] += VECTORS[action][0]
    actor.position[1] += VECTORS[action][1]
    this._setPosition(actor)
  }

  _getRandomPosition = (): Vector => {
    let position = [0, 0]
    while (true) {
      position = [randomScalar(), randomScalar()]
      if (this.grid[position[0]][position[1]] === SPRITES.EMPTY) {
        break
      }
    }
    return position
  }

  _getActions = (row: number, col: number) => {
    const actions = []
    const max = BOARD.BOARD_LENGTH - 1
    if (row < 0 || col < 0 || col > max || row > max) return actions
    row > 0 &&
      this.grid[row - 1][col] !== SPRITES.TREE &&
      actions.push(ACTIONS.NORTH)
    row < max &&
      this.grid[row + 1][col] !== SPRITES.TREE &&
      actions.push(ACTIONS.SOUTH)
    col > 0 &&
      this.grid[row][col - 1] !== SPRITES.TREE &&
      actions.push(ACTIONS.WEST)
    col < max &&
      this.grid[row][col + 1] !== SPRITES.TREE &&
      actions.push(ACTIONS.EAST)
    return actions
  }

  _setPosition = (actor: Actor) => {
    this.grid[actor.position[0]][actor.position[1]] = actor.sprite
  }

  _clearPosition = (pos: Vector) => {
    this.grid[pos[0]][pos[1]] = SPRITES.EMPTY
  }
}

const samePosition = (posA: Vector, posB: Vector) =>
  posA[0] === posB[0] && posA[1] === posB[1]

const distance = (posA: Vector, posB: Vector) =>
  Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1])

const randomScalar = () => Math.floor(Math.random() * BOARD.BOARD_LENGTH)

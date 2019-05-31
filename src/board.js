// @flow
import { SPRITES, BOARD, ACTIONS, VECTORS, TIME } from './constants'
import { buildActor } from './actors'
import type {
  Actor,
  Vector,
  Grid,
  Action,
  GameBoard as GameBoardType,
  WorkerMessage,
  OnlineMessage,
} from './types'

let isTraining = false

// Game model
export class GameBoard implements GameBoardType {
  grid: Grid
  actors: Array<Actor>
  gameIterations: number
  timerId: IntervalID
  worker: any // Web worker instance
  valuesDisplay: null | number = null

  // Create a new gameboard with a grid and some actors
  constructor(grid: Grid, actors: Array<Actor>, worker?: any) {
    this.worker = worker
    this.grid = grid
    this.gameIterations = 0
    this.actors = actors
    for (let actor of this.actors) {
      const startPosition = this._getRandomPosition()
      actor.position = startPosition
      this._setPosition(actor)
    }
  }

  // Run the game for many timesteps.
  // Run it online - ie. include a time delay so the user can see it render.
  runGame = () => {
    this.timerId = setInterval(this.runGameTimestep, TIME.TICK)
  }

  // Run the game for one timestep.
  runGameTimestep = () => {
    // Reset the game if it finishes, or reaches maximum steps.
    const actorDistance = distance(
      this.actors[0].position,
      this.actors[1].position
    )
    const gameOver = actorDistance < 2
    const gameTooLong = this.gameIterations >= TIME.MAX_EPISODE_LENGTH
    if (gameOver || gameTooLong) {
      // Game over
      this.gameIterations = 0
      for (let actor of this.actors) {
        if (gameOver) actor.onGameEnd()
        this._clearPosition(actor.position)
        actor.position = this._getRandomPosition()
        this._setPosition(actor)
      }
    }
    // Calculate positions for next timestep
    this.gameIterations++
    let prevPosition = null
    for (let [idx, actor] of this.actors.entries()) {
      const opponentPosition = prevPosition || this.actors[1].position
      const action = actor.onTimestep(this.grid, opponentPosition)
      prevPosition = actor.position
      this._move(actor, action)
    }
  }

  // Start a new game, with the actors starting in new positions
  newGame = () => {
    this.gameIterations = 0
    for (let actor of this.actors) {
      this._clearPosition(actor.position)
      actor.position = this._getRandomPosition()
      this._setPosition(actor)
    }
  }

  // Returns true if one of the current actors are trainable
  getCanTrain = () => this.actors.some(a => a.hasValues)

  // Get number of games played for each actor
  getGamesPlayed = () => this.actors.map(a => a.gamesPlayed)

  // Send actors to the web worker thread for offline training.
  trainActors = (onProgress, onDone) => {
    if (isTraining) return
    isTraining = true
    // Callback for when traning is done
    this.worker.onmessage = (e: { data: OnlineMessage }) => {
      const { isTrainingDone, trainingProgress, actorMessages } = e.data
      if (isTrainingDone && actorMessages) {
        // Training is done, replace online actors with actors from offline training
        this.actors = actorMessages.map((am, idx) =>
          this.actors[idx].deserialize(am)
        )
        isTraining = false
        onDone()
      } else {
        // Training is not done, display progress to the user
        onProgress(trainingProgress)
      }
    }
    // Start training in web worker
    const message: WorkerMessage = {
      actorMessages: this.actors.map(a => a.serialize()),
      grid: this.grid,
    }
    this.worker.postMessage(message)
  }

  // Select a new type of actor for the game, deleting the old one.
  selectActor = (actorIdx, newType) => {
    const currentActor = this.actors[actorIdx]
    if (newType === currentActor.type) return false
    this._clearPosition(currentActor.position)
    const newActor = buildActor(newType)
    this.actors[actorIdx] = newActor
    newActor.position = this._getRandomPosition()
    this._setPosition(newActor)
    return true
  }

  // Reset an actor, so it forgets what it has learned
  resetActor = actorIdx => {
    const currentActor = this.actors[actorIdx]
    const newActor = buildActor(currentActor.type)
    newActor.position = currentActor.position
    this.actors[actorIdx] = newActor
  }

  toggleValueDisplay = actorIdx => {
    if (this.valuesDisplay) {
      this.valuesDisplay = null
    }
    const actor = this.actors[actorIdx]
    if (actor.hasValues && actorIdx !== this.valuesDisplay) {
      this.valuesDisplay = actorIdx
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

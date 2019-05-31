import { TIME } from './constants'
import { buildActor } from './actors'
import { GameBoard } from './board'

let isTraining = false

const MESSAGE_PERIOD = TIME.TRAINING_STEPS / 100

onmessage = e => {
  if (isTraining) return
  isTraining = true
  const { actorMessages, grid } = e.data
  const actors = actorMessages.map(am => buildActor(am.type).deserialize(am))
  const board = new GameBoard(grid, actors)
  for (let i = 0; i < TIME.TRAINING_STEPS; i++) {
    board.runGameTimestep()
    if (i % MESSAGE_PERIOD === 0) {
      postMessage({
        isTrainingDone: false,
        trainingProgress: Math.floor((100 * i) / TIME.TRAINING_STEPS),
      })
    }
  }
  postMessage({
    isTrainingDone: true,
    trainingProgress: 100,
    actorMessages: actors.map(a => a.serialize()),
  })
  isTraining = false
}

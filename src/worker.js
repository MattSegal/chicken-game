import C from './constants'
import { buildChickenActor, buildFoxActor } from './actors'
import GameBoard from './gameboard'

let isTraining = false


onmessage = e => {
  if (isTraining) return
  isTraining = true
  const { chickenData, foxData, grid } = e.data

  const chickenActor = buildChickenActor(chickenData.type)
  chickenActor.deserialize(chickenData)

  const foxActor = buildFoxActor(foxData.type)
  foxActor.deserialize(foxData)

  const board = new GameBoard(grid)
  board.addFox(foxActor)
  board.addChicken(chickenActor)

  for (let i = 0; i < C.TRAINING_STEPS; i++) {
    board.run(board.reset)
    if (i % 1000 === 0 ) {
      postMessage({
        done: false,
        progress: Math.floor(100 * i / C.TRAINING_STEPS)
      })
    }
  }

  postMessage({
    done: true,
    chickenData: chickenActor.serialize(),
    foxData: foxActor.serialize()
  })
  isTraining = false
}

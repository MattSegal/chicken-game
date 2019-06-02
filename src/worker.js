// @flow
import { TIME } from './constants'
import { buildActor } from './actors'
import { GameBoard } from './board'
import type { WorkerMessage, OnlineMessage } from 'types'

let isTraining = false

declare function postMessage(OnlineMessage): void

onmessage = (e: { data: WorkerMessage }) => {
  if (isTraining) return
  isTraining = true
  const { actorMessages, grid } = e.data
  const actors = [
    buildActor(actorMessages[0].type),
    buildActor(actorMessages[1].type),
  ]
  const board = new GameBoard(grid)
  for (let i = 0; i < TIME.TRAINING_STEPS; i++) {
    board.run(board.reset)
    if (i % 1000 === 0) {
      postMessage({
        done: false,
        progress: Math.floor((100 * i) / TIME.TRAINING_STEPS),
      })
    }
  }
  postMessage({
    done: true,
    progress: 100,
    actorMessages: [actors[0].serialize(), actors[1].serialize()],
  })
  isTraining = false
}

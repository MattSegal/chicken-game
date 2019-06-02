// @flow
import { TIME } from 'constants'
import { GameBoard } from './gameboard'
import Worker from '../worker'
import type {
  OnlineGameBoard as OnlineGameBoardType,
  WorkerMessage,
  OnlineMessage,
} from 'types'

// @noflow
const worker = new Worker()
let isTraining = false

// sends training requests to the web worker thread
export class OnlineGameBoard extends GameBoard implements OnlineGameBoardType {
  timerId: IntervalID

  train = (onProgress: number => void, onDone: () => void) => {
    if (isTraining) return
    isTraining = true
    worker.onmessage = (e: { data: OnlineMessage }) => {
      const { done, progress, actorMessages } = e.data
      if (done && actorMessages) {
        for (let [idx, msg] of actorMessages) {
          this.actors[idx] = this.actors[idx].deserialize(msg)
        }
        onDone()
        isTraining = false
      } else {
        onProgress(progress)
      }
    }
    const message: WorkerMessage = {
      actorMessages: [this.actors[0].serialize(), this.actors[1].serialize()],
      grid: this.grid,
    }
    worker.postMessage(message)
  }

  _runInterval = () => {
    this.timerId = setInterval(() => {
      // Set new positions for actors
      this.run(this._resetInterval)
    }, TIME.TICK)
  }

  _resetInterval = () => {
    clearInterval(this.timerId)
    setTimeout(() => {
      this.reset()
      this._runInterval()
    }, 3 * TIME.TICK)
  }
}

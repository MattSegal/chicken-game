import C from './constants'
import GameBoard from './gameboard'
import Worker from './worker'

const worker = new Worker()
let isTraining = false

// sends training requests to the web worker thread
export default class OnlineGameBoard extends GameBoard {

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

  // Progress called with an integer 0 - 100, done called when done
  train = (onProgress, onDone) => {
    let foxActor = this.foxActor
    let chickenActor = this.chickenActor
    if (isTraining || !foxActor || !chickenActor) return
    isTraining = true
    worker.onmessage = e => {
      const { done, progress, chickenData, foxData, grid } = e.data
      if (done) {
        foxActor.deserialize(foxData)
        chickenActor.deserialize(chickenData)
        onDone()
        isTraining = false
        console.log('Finished offline training')
      } else {
        onProgress(progress)
      }
    }
    console.log('Start offline training')
    worker.postMessage({
      chickenData: chickenActor.serialize(),
      foxData: foxActor.serialize(),
      grid: this.grid,
    })
  }
}

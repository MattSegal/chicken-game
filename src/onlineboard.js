import C from './constants'
import GameBoard from './gameboard'
import Worker from './worker'

const worker = new Worker()
let isTraining = false

// sends training requests to the web worker thread
export default class OnlineGameBoard extends GameBoard {

  setValueActor = (actor) => {
    // Display value function for this actor
    if (actor === this.valueActor) {
      this.valueActor = null
    } else {
      this.valueActor = actor
    }
  }

  getActorValues = () =>  {
    if (this.foxActor && this.valueActor === this.foxActor) {
      return this.foxActor.getValues(this.chickenPosition)
    } else if (this.chickenActor && this.valueActor === this.chickenActor) {
      return this.chickenActor.getValues(this.foxPosition)
    } else {
      this.valueActor = null
      return null
    }
  }

  runInterval = () => {
    this.timerId = setInterval(() => {
      // Set new positions for actors
      this.run(this.resetInterval)
    }, C.TICK)
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
      } else {
        onProgress(progress)
      }
    }
    worker.postMessage({
      chickenData: chickenActor.serialize(),
      foxData: foxActor.serialize(),
      grid: this.grid,
    })
  }
}

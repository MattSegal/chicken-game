import { ACTIONS, BOARD, SPRITES } from '../constants'
import { Actor } from './base'
import { StateSpace } from './state-space'
import { randomChoice } from 'utils'
import type {
  Sprite,
  Action,
  Vector,
  ActorMessage,
  ActorType as ActorTypeType, // I regret nothing
} from 'types'

type State = {
  value: number,
  visits: number,
}

export default class MonteCarloActor extends Actor {
  isFleeing: boolean
  episodeReward: number
  states: StateSpace<State>
  seen: Array<number>
  constructor(sprite: Sprite, type: ActorTypeType) {
    super(sprite, type)
    this.isFollowing = sprite === SPRITES.CHICKEN
    this.episodeReward = 0
    this.seen = []
    this.states =
      new StateSpace() <
      State >
      (() => ({
        value: 0,
        visits: 0,
      }))
  }
  serialize(): ActorMessage {
    return {
      games: this.games,
      type: this.type,
      states: this.states._states,
    }
  }
  deserialize(data: any) {
    this.seen = []
    this.episodeReward = 0
    this.games = data.games
    this.states._states = data.states
  }
  reset = () => {
    // Reset any global actor state
    this.games = 0
    this.seen = []
    this.episodeReward = 0
    this.states =
      new StateSpace() <
      State >
      (() => ({
        value: 0,
        visits: 0,
      }))
  }
  getValues(targetPosition: Vector) {
    const arr: Array<Array<number>> = Array(BOARD.BOARD_LENGTH)
      .fill(0)
      .map(c => Array(BOARD.BOARD_LENGTH).fill(0))
    const ranking: Array<number> = []
    // Get a grid of values for a given target position
    // normalized from 0 to 1
    for (let a = 0; a < BOARD.BOARD_LENGTH; a++) {
      // actor row
      for (let b = 0; b < BOARD.BOARD_LENGTH; b++) {
        // actor col
        if (!arr[a]) arr[a] = []
        const key = this.states.getKey(
          a,
          b,
          targetPosition[0],
          targetPosition[1]
        )
        const val = this.states.getState(key).value
        arr[a].push(val)
        ranking.push(val)
      }
    }
    // Normalize results to range [0,1]
    ranking.sort((a, b) => a - b)
    for (let a = 0; a < BOARD.BOARD_LENGTH; a++) {
      // actor row
      for (let b = 0; b < BOARD.BOARD_LENGTH; b++) {
        // actor col
        arr[a][b] = ranking.indexOf(arr[a][b]) / (ranking.length - 1)
      }
    }
    return arr
  }

  getReward(distance: number) {
    if (this.isFleeing) {
      // Encourage a fleer to keep away
      return distance < 5 ? -1 : 1
    } else {
      // Encourage a follower to close the distance
      return -1 * distance
    }
  }

  endGame() {
    // Update our value function with information from this episode
    for (let seenKey of this.seen) {
      const state = this.states.getState(seenKey)
      state.visits += 1
      const error = this.episodeReward - state.value
      state.value += error / state.visits
    }
    // Reset our reward and seen states
    this.episodeReward = 0
    this.seen = []
    this.games++
  }

  timestep(getActions, resetGame, position, targetPosition) {
    // Record the reward we got for this timestep
    const distance = Actor.getManhattanDistance(position, targetPosition)
    this.episodeReward += this.getReward(distance)

    // Record our visit to this state
    const lookupKey = this.states.getKeyFromPositions(position, targetPosition)
    this.seen.push(lookupKey)

    // Evaluate all possible actions
    const actions = getActions(position[0], position[1])
    actions.push(null) // Give the actor the option of not moving

    // We're using e-greedy policy improvement strategy
    // There is an epsilon chance of randomly picking our next move
    const epsilon = 1 / Math.sqrt(this.games)
    let chosenAction
    if (Math.random() < epsilon) {
      chosenAction = this.chooseActionRandomly(actions)
    } else {
      chosenAction = this.chooseActionGreedily(
        actions,
        position,
        targetPosition
      )
    }
    return chosenAction
  }

  chooseActionRandomly(actions) {
    return randomChoice(actions)
  }

  chooseActionGreedily(actions, position, targetPosition) {
    // Using the current value function, greedily choose where we're going to go next
    let bestAction = null
    let bestValue = Number.NEGATIVE_INFINITY
    let newPosition = position

    for (let action of actions) {
      // Find the actor's new position given the action
      let actionPosition
      if (action) {
        actionPosition = Actor.getNewPosition(action, position)
      } else {
        actionPosition = position
      }

      // If this new action is more valuable than our best option, choose that
      const actionValue = this.states.getStateFromPositions(
        actionPosition,
        targetPosition
      ).value
      if (actionValue > bestValue) {
        bestValue = actionValue
        bestAction = action
        newPosition = actionPosition
      }
    }
    return bestAction
  }
}

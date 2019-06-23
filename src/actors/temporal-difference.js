// @flow
import { BOARD, SPRITES } from '../constants'
import { Actor } from './base'
import { StateSpace } from './state-space'
import { randomChoice } from '../utils'
import type {
  Sprite,
  Action,
  Vector,
  ActorMessage,
  Grid,
  Actor as ActorType,
  ActorType as ActorTypeType, // I regret nothing
} from '../types'

const ALPHA = 0.99
const GAMMA = 0.99

type State = {
  value: number,
}

export default class TemporalDifferenceActor extends Actor {
  isFleeing: boolean
  states: StateSpace<State>
  hasValues = true

  constructor(sprite: Sprite, type: ActorTypeType) {
    super(sprite, type)
    this.isFleeing = sprite === SPRITES.CHICKEN
    const initFunction = () => ({ value: 0.1 * Math.random() })
    this.states = new StateSpace(initFunction)
  }

  onTimestep(grid: Grid, targetPosition: Vector): Action {
    const actions = this.getAvailableActions(grid, this.position)
    actions.push(null) // Give the actor the option of not moving

    // We're using e-greedy policy improvement strategy
    // There is an epsilon chance of randomly picking our next move
    const epsilon = 1 / Math.sqrt(this.gamesPlayed)
    let chosenAction
    if (Math.random() < epsilon) {
      chosenAction = this.chooseActionRandomly(actions)
    } else {
      chosenAction = this.chooseActionGreedily(
        actions,
        this.position,
        targetPosition
      )
    }
    const newPosition = Actor.getNewPosition(chosenAction, this.position)

    // Using the expected value of our next move, update the value function
    // with the temporal difference algorithm
    const distance = Actor.getManhattanDistance(this.position, targetPosition)
    const reward = this.getReward(distance)
    const currentValue = this.states.getStateFromPositions(
      this.position,
      targetPosition
    ).value
    const expectedValue = this.states.getStateFromPositions(
      newPosition,
      targetPosition
    ).value
    const targetValue = reward + GAMMA * expectedValue
    const error = targetValue - currentValue
    const newValue = currentValue + ALPHA * error
    const currentState = this.states.getStateFromPositions(
      this.position,
      targetPosition
    )
    currentState.value = newValue
    return chosenAction
  }

  // Transform data for transfer to web worker
  serialize(): ActorMessage {
    return {
      type: this.type,
      data: {
        gamesPlayed: this.gamesPlayed,
        stateSpace: this.states._states,
      },
    }
  }

  deserialize(message: ActorMessage) {
    this.gamesPlayed = message.data.gamesPlayed
    const { stateSpace } = message.data
    if (stateSpace) {
      this.states._states = stateSpace
    }
    return this
  }

  getValues(targetPosition: Vector) {
    const arr = []
    const ranking = []
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
    // @noflow
    return arr
  }

  getReward(distance: number) {
    if (this.isFleeing) {
      // Encourage a fleer to keep away
      if (distance == 1) {
        return -10
      } else {
        return 0
      }
    } else {
      // Encourage a follower to close the distance
      if (distance == 1) {
        return 10
      } else {
        return 0
      }
    }
  }

  chooseActionRandomly(actions: Array<Action>) {
    return randomChoice(actions)
  }

  chooseActionGreedily(
    actions: Array<Action>,
    position: Vector,
    targetPosition: Vector
  ) {
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

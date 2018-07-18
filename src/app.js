import React, { Component } from 'react'

import C from './constants'
import PlayerActor from './actors/player'
import GreedyActor from './actors/greedy'
import RandomActor from './actors/random'
import AStarActor from './actors/a-star'
import TemporalDifferenceActor from './actors/temporal-difference'
import MonteCarloActor from './actors/monte-carlo'

const chickenOptions = {
  // 'temporal difference': board => new TemporalDifferenceActor('chicken', C.CHICKEN, board),
  // 'monte carlo': board => new MonteCarloActor('chicken', C.CHICKEN, board),
  random: new RandomActor(C.CHICKEN),
  // 'greedy flight': board => (new GreedyActor('chicken', C.CHICKEN, board)).flee(),
  player: new PlayerActor(C.CHICKEN),
}

const foxOptions = {
  // 'greedy pursuit': board => (new GreedyActor('fox', C.FOX, board)).follow(),
  // 'a* search': board => new AStarActor('fox', C.FOX, board),
  // 'monte carlo': board => (new MonteCarloActor('fox', C.FOX, board)).follow(),
  // 'temporal difference': board => (new TemporalDifferenceActor('fox', C.FOX, board)).follow(),
  random: new RandomActor(C.FOX),
  player: new PlayerActor(C.FOX),
}


export default class App extends Component {

  constructor(props) {
    super(props)
    this.board = props.board
    this.board.addFox(foxOptions[Object.keys(foxOptions)[0]])
    this.board.addChicken(chickenOptions[Object.keys(chickenOptions)[0]])
    this.board.runInterval()

    this.state = {

    }
  }

  onSelectChicken = e => {
    const key = e.target.value
    e.target.blur()
    this.board.addChicken(chickenOptions[key])
  }

  onSelectFox = e => {
    e.target.blur()
    this.board.addFox(foxOptions[e.target.value])
  }

  onNewGame = e => this.board.reset()

  onTrain = e => {
    this.board.runIters(C.TRAINING_STEPS)
    this.board.reset()
    this.board.runInterval()
  }

  render() {
    return (
        <div>
          <div className="control">
            <label>chicken algorithm</label>
            <select onChange={this.onSelectChicken}>
              {Object.keys(chickenOptions).map(k =>
                <option key={k} value={k}>{k}</option>
              )}
            </select>
          </div>
          <div className="control">
            <label>fox algorithm</label>
            <select onChange={this.onSelectFox}>
              {Object.keys(foxOptions).map(k =>
                <option key={k} value={k}>{k}</option>
              )}
            </select>
          </div>
          <div className="button" onClick={this.onNewGame}>
            new game
          </div>
          <div className="button" onClick={this.onTrain}>
            train
          </div>

        </div>
    )
  }
}



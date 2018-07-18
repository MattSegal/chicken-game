import C from 'constants'

import PlayerActor from './actors/player'
import GreedyActor from './actors/greedy'
import RandomActor from './actors/random'
import AStarActor from './actors/a-star'
import TemporalDifferenceActor from './actors/temporal-difference'
import MonteCarloActor from './actors/monte-carlo'

const chickenOptions = {
  'temporal difference': board => new TemporalDifferenceActor('chicken', C.CHICKEN, board),
  'monte carlo': board => new MonteCarloActor('chicken', C.CHICKEN, board),
  random: board => new RandomActor('chicken', C.CHICKEN, board),
  'greedy flight': board => (new GreedyActor('chicken', C.CHICKEN, board)).flee(),
  player: board => new PlayerActor('chicken', C.CHICKEN, board),
}

const foxOptions = {
  'greedy pursuit': board => (new GreedyActor('fox', C.FOX, board)).follow(),
  'a* search': board => new AStarActor('fox', C.FOX, board),
  'monte carlo': board => (new MonteCarloActor('fox', C.FOX, board)).follow(),
  'temporal difference': board => (new TemporalDifferenceActor('fox', C.FOX, board)).follow(),
  random: board => new RandomActor('fox', C.FOX, board),
  player: board => new PlayerActor('fox', C.FOX, board),
}


export default class Controller {
  constructor(board) {
    this.board = board
    this.actors = {}

    board.addFox(foxOptions[Object.keys(foxOptions)[0]](board))
    board.addChicken(chickenOptions[Object.keys(chickenOptions)[0]](board))

    this.node = document.getElementById('controls')
    this.buildSelect('chicken algorithm', chickenOptions, this.onSelectChicken)
    this.buildSelect('fox algorithm', foxOptions, this.onSelectFox)
    this.buildButton('new game', this.onNewGame)
    this.trainBtn = this.buildButton('train', this.onTrain)
    board.runInterval()
  }

  onNewGame = e => this.board.reset()
  onSelectFox = e => {
    e.target.blur()
    this.board.addFox(foxOptions[e.target.value](this.board))
  }
  onSelectChicken = e => {
    const key = e.target.value
    e.target.blur()
    this.board.addChicken(chickenOptions[key](this.board))
  }
  onTrain = e => {
    this.board.runIters(C.TRAINING_STEPS)
    this.board.reset()
    this.board.runInterval()
  }

  buildSelect(text, options, onChange) {
    const select = document.createElement('select')
    for (let key in options) {
      const option = document.createElement('option')
      option.value = key
      option.append(key)
      select.appendChild(option)
    }
    select.onchange = onChange
    const label = document.createElement('label')
    label.append(text)
    const control = document.createElement('div')
    control.classList.add('control')
    control.appendChild(label)
    control.appendChild(select)
    this.node.appendChild(control)
    return control
  }

  buildButton(text, onClick) {
    const button = document.createElement('div')
    button.classList.add('button')
    button.onclick = onClick
    button.append(text)
    this.node.appendChild(button)
    return button
  }
}


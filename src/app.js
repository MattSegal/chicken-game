import React, { Component } from 'react'

import C from './constants'
import { 
  LEARNING_ALGOS,
  FOX_ALGOS,
  CHICKEN_ALGOS,
  getChickenActor,
  getFoxActor
} from './actors'


export default class App extends Component {

  constructor(props) {
    super(props)
    this.board = props.board
    const foxAlgorithm = Object.values(FOX_ALGOS)[0]
    const chickenAlgorithm = Object.values(CHICKEN_ALGOS)[0]
    const foxActor = getFoxActor(foxAlgorithm)
    const chickenActor = getChickenActor(chickenAlgorithm)
    this.board.addChicken(chickenActor)
    this.board.addFox(foxActor)
    this.board.runInterval()
    this.state = {
      isTraining: false,
      progress: 0,
      chicken: {
        games: 0,
        actor: chickenActor,
        algorithm: chickenAlgorithm,
      },
      fox: {
        games: 0,
        actor: foxActor,
        algorithm: foxAlgorithm,
      }
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        ...this.state,
        chicken: {...this.state.chicken, games: this.state.chicken.actor.numGames},
        fox: {...this.state.fox, games: this.state.fox.actor.numGames}
      })
    }, 500)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.chicken.algorithm !== prevState.chicken.algorithm) {
      this.board.addChicken(this.state.chicken.actor)
    } else if (this.state.fox.algorithm !== prevState.fox.algorithm) {
      this.board.addFox(this.state.fox.actor)
    }
  }

  onSelectChicken = e => {
    const algorithm = e.target.value
    if (algorithm === this.state.chicken.algorithm) return
    this.board.setValueActor(null)
    const actor = getChickenActor(algorithm)
    this.setState({ chicken: { games: actor.numGames, actor: actor, algorithm: algorithm }})
    e.target.blur()
  }

  onSelectFox = e => {
    const algorithm = e.target.value
    if (algorithm === this.state.fox.algorithm) return
    this.board.setValueActor(null)
    const actor = getFoxActor(algorithm)
    this.setState({ fox: { games: actor.numGames, actor: actor, algorithm: algorithm }})
    e.target.blur()
  }

  onNewGame = e => this.board.reset()

  onTrain = e => {
    this.setState({ isTraining: true })
    this.board.train(this.onTrainingProgress, this.onDoneTraining)
  }

  onTrainingProgress = progress => this.setState({ progress: progress })
  onDoneTraining = () => this.setState({ isTraining: false, progress: 0 })
  onValues = actor => {
    // Display value function for that actor
    this.board.setValueActor(actor)
  }

  render() {
    return (
        <div>
          <ActorPanel
            label="chicken"
            onSelect={this.onSelectChicken}
            algorithms={CHICKEN_ALGOS}
            games={this.state.chicken.games}
            onReset={this.state.chicken.actor.reset}
            onValues={() => this.onValues(this.state.chicken.actor)}
            isTraining={this.state.isTraining}
            currentType={this.state.chicken.actor.type}
          />
          <ActorPanel
            label="fox"
            onSelect={this.onSelectFox}
            algorithms={FOX_ALGOS}
            games={this.state.fox.games}
            onReset={this.state.fox.actor.reset}
            onValues={() => this.onValues(this.state.fox.actor)}
            isTraining={this.state.isTraining}
            currentType={this.state.fox.actor.type}
          />
          <div className="buttonRow">
            <div className="button" onClick={this.onNewGame} disabled={this.state.isTraining}>
              new game
            </div>
            <div className="button" onClick={this.onTrain} disabled={this.state.isTraining}>
              <div className="progress" style={{'right': `${100 - this.state.progress}%`}}></div>
              train
            </div>
          </div>
        </div>
    )
  }
}

const ActorPanel = ({label, isTraining, algorithms, onReset, onSelect, currentType, games, onValues}) => (
  <div className="control">
    <label>{label}</label>
    <select onChange={onSelect} disabled={isTraining}>
      {Object.values(algorithms).map(v =>
        <option key={v} value={v}>{v}</option>
      )}
    </select>
    {isLearning(currentType) && (
    <div className="button" onClick={onValues} disabled={isTraining}>
      values
    </div>
    )}
    {isLearning(currentType) && (
    <div className="button" onClick={onReset} disabled={isTraining}>
      reset
    </div>
    )}
    {isLearning(currentType) && <span className="games">{displayGames(games)} games</span>}
    
  </div>
)


const isLearning = type => LEARNING_ALGOS.includes(type)

const displayGames = games => games > 1000
  ? ((games - (games % 1000)) / 1000) + 'k'
  : games

// @flow
import React, { Component } from 'react'

import { buildActor, CHICKEN_ALGOS, FOX_ALGOS, LEARNING_ALGOS } from './actors'
import type { GameBoard, Actor, ActorType } from './types'

const CHICKEN_IDX = 0
const FOX_IDX = 1
const UPDATE_TICK = 500 // ms

type Props = {
  board: GameBoard,
}

type State = {
  isTraining: boolean,
  progress: number,
  games: [number, number],
}

export default class App extends Component<Props, State> {
  board: GameBoard
  constructor(props: Props) {
    super(props)
    this.board = props.board
    this.board.run()
    this.state = {
      isTraining: false,
      progress: 0,
      games: [0, 0],
    }
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        ...this.state,
        games: [
          this.board.actors[CHICKEN_IDX].games,
          this.board.actors[FOX_IDX].games,
        ],
      })
    }, UPDATE_TICK)
  }
  onSelect = (idx: 0 | 1) => (e: SyntheticInputEvent<any>) => {
    const currentActor = this.board.actors[idx]
    // @noflow
    const actorType: ActorType = e.target.value
    if (actorType === currentActor.type) return
    this.board.actors[idx] = buildActor(actorType)
    const games = [...this.state.games]
    games[idx] = 0
    e.target.blur()
  }
  onNewGame = () => this.board.reset()
  onTrain = () => {
    this.setState({ isTraining: true })
    this.board.train(this.onTrainingProgress, this.onDoneTraining)
  }
  onTrainingProgress = (progress: number) => this.setState({ progress })
  onDoneTraining = () => this.setState({ isTraining: false, progress: 0 })
  onValues = (actor: Actor) => {
    // Display value function for that actor
    // this.board.setValueActor(actor)
  }
  render() {
    const chickenActor = this.board.actors[CHICKEN_IDX]
    const foxActor = this.board.actors[FOX_IDX]
    return (
      <div>
        <ActorPanel
          label="chicken"
          algorithms={CHICKEN_ALGOS}
          games={this.state.games[CHICKEN_IDX]}
          isTraining={this.state.isTraining}
          currentType={chickenActor.type}
          onReset={chickenActor.reset}
          onValues={() => this.onValues(chickenActor)}
          onSelect={this.onSelect(CHICKEN_IDX)}
        />
        <ActorPanel
          label="fox"
          algorithms={FOX_ALGOS}
          games={this.state.games[FOX_IDX]}
          isTraining={this.state.isTraining}
          currentType={foxActor.type}
          onReset={foxActor.reset}
          onValues={() => this.onValues(foxActor)}
          onSelect={this.onSelect(FOX_IDX)}
        />
        <div className="buttonRow">
          <div
            className="button"
            onClick={this.onNewGame}
            disabled={this.state.isTraining}
          >
            new game
          </div>
          <div
            className="button"
            onClick={this.onTrain}
            disabled={this.state.isTraining}
          >
            <div
              className="progress"
              style={{ right: `${100 - this.state.progress}%` }}
            />
            train
          </div>
        </div>
      </div>
    )
  }
}

type PanelProps = {
  label: string,
  isTraining: boolean,
  algorithms: { [ActorType]: string },
  currentType: ActorType,
  games: number,
  onValues: Function,
  onReset: Function,
  onSelect: Function,
}

const ActorPanel = ({
  label,
  isTraining,
  algorithms,
  currentType,
  games,
  onReset,
  onSelect,
  onValues,
}: PanelProps) => (
  <div className="control">
    <label>{label}</label>
    <select onChange={onSelect} disabled={isTraining}>
      {Object.entries(algorithms).map(([k, v]) => (
        <option key={k} value={k}>
          {String(v)}
        </option>
      ))}
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
    {isLearning(currentType) && (
      <span className="games">{displayGames(games)} games</span>
    )}
  </div>
)

const isLearning = (type: ActorType) => LEARNING_ALGOS.includes(type)

const displayGames = games =>
  games > 1000 ? (games - (games % 1000)) / 1000 + 'k' : games

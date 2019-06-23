// @flow
import React, { Component } from 'react'

import * as Grid from './grid'
import * as View from './view'
import { GameBoard } from './board'
import Worker from './worker'
import { buildActor, CHICKEN_ALGOS, FOX_ALGOS } from './actors'
import type {
  GameBoard as GameBoardType,
  Grid as GridType,
  Actor,
  ActorType,
} from './types'

const worker = new Worker()

const UPDATE_TICK = 500 // ms

type Props = {}
type State = {
  isTraining: boolean,
  progress: number,
  games: Array<number>,
}

const ACTOR_DATA = [
  {
    label: 'chicken',
    algos: CHICKEN_ALGOS,
  },
  {
    label: 'fox',
    algos: FOX_ALGOS,
  },
]

export class App extends Component<Props, State> {
  board: GameBoardType
  grid: GridType
  // Setup actors, board, view
  constructor(props: Props) {
    super(props)
    this.grid = Grid.create()
    const chicken = buildActor('CHICKEN_TEMPORAL_DIFFERENCE')
    const fox = buildActor('FOX_GREEDY')
    this.board = new GameBoard(this.grid, [chicken, fox], worker)
    View.drawWhenReady(this.board)
    this.board.runGame()
    this.state = {
      isTraining: false,
      progress: 0,
      games: [0, 0],
    }
  }
  // Ensure the number of games played updates.
  componentDidMount() {
    setInterval(() => {
      this.setState({ games: this.board.getGamesPlayed() })
    }, UPDATE_TICK)
  }
  // When a user selects a new actor type from the drop-down.
  onSelectActorType = (idx: number) => (e: SyntheticInputEvent<any>) => {
    // @noflow
    const actorType: ActorType = e.target.value
    // @noflow
    const created = this.board.selectActor(idx, actorType)
    e.target.blur()
    if (created) {
      const games = [...this.state.games]
      games[idx] = 0
      this.setState({ games })
    }
  }
  // When the user hits the new game button.
  onNewGame = () => this.board.newGame()
  // When the user hits the "train" button
  onTrain = () => {
    if (this.state.isTraining || !this.board.getCanTrain()) return
    this.setState({ isTraining: true })
    this.board.trainActors(this.onTrainingProgress, this.onDoneTraining)
  }
  // Callback for when training is progressing.
  onTrainingProgress = (progress: number) => this.setState({ progress })
  // Callback for when training is finished.
  onDoneTraining = () => this.setState({ isTraining: false, progress: 0 })
  // Visualize actor value function
  showValues = () => {
    // ???
  }
  render() {
    const { isTraining, games, progress } = this.state
    return (
      <React.Fragment>
        {this.board.actors.map((actor, idx) => (
          <ActorPanel
            key={idx}
            label={ACTOR_DATA[idx].label}
            algorithms={ACTOR_DATA[idx].algos}
            games={games[idx]}
            isTraining={isTraining}
            currentType={actor.type}
            onReset={() => this.board.resetActor(idx)}
            hasValues={this.board.actors[idx].hasValues}
            onSelect={this.onSelectActorType(idx)}
          />
        ))}
        <div className="buttonRow">
          <div
            className="button"
            onClick={this.onNewGame}
            disabled={isTraining}
          >
            new game
          </div>
          <div
            className="button"
            onClick={this.onTrain}
            disabled={isTraining || !this.board.getCanTrain()}
          >
            <div className="progress" style={{ right: `${100 - progress}%` }} />
            train
          </div>
        </div>
      </React.Fragment>
    )
  }
}

type PanelProps = {
  label: string,
  isTraining: boolean,
  algorithms: { [ActorType]: string },
  currentType: ActorType,
  games: number,
  hasValues: boolean,
  // onValues: Function,
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
  // onValues,
  hasValues,
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
    {hasValues && (
      <div className="button" onClick={() => {}} disabled={isTraining}>
        values
      </div>
    )}
    {hasValues && (
      <div className="button" onClick={onReset} disabled={isTraining}>
        reset
      </div>
    )}
    {hasValues && <span className="games">{displayGames(games)} games</span>}
  </div>
)

const displayGames = games =>
  games > 1000 ? (games - (games % 1000)) / 1000 + 'k' : games

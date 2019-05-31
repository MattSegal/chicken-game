// @flow
export type Action = 'N' | 'S' | 'E' | 'W' | null
export type Vector = [number, number]
export type Sprite = 0 | 1 | 2 | 3
export type Grid = Array<Array<Sprite>>

export type ActorType =
  | 'CHICKEN_TEMPORAL_DIFFERENCE'
  | 'CHICKEN_MONTE_CARLO'
  | 'CHICKEN_RANDOM'
  | 'CHICKEN_PLAYER'
  | 'CHICKEN_GREEDY'
  | 'FOX_TEMPORAL_DIFFERENCE'
  | 'FOX_MONTE_CARLO'
  | 'FOX_A_STAR'
  | 'FOX_RANDOM'
  | 'FOX_PLAYER'
  | 'FOX_GREEDY'

export type ActorMessage = {
  type: ActorType,
  data: {
    gamesPlayed: number,
    stateSpace?: any,
  },
}

export type WorkerMessage = {
  actorMessages: Array<ActorMessage>,
  grid: Grid,
}

export type OnlineMessage = {
  actorMessages?: Array<ActorMessage>,
  trainingProgress: number,
  isTrainingDone: boolean,
}

export interface Actor {
  type: ActorType;
  sprite: Sprite;
  position: Vector;
  gamesPlayed: number;
  hasValues: boolean;
  onTimestep(grid: Grid, target: Vector): Action;
  onGameEnd(): void;
  serialize(): ActorMessage;
  deserialize(ActorMessage): Actor;
  getValues(target: Vector): Array<Array<number>> | null;
}

export interface GameBoard {
  grid: Grid;
  actors: Array<Actor>;
  valuesDisplay: number | null;
  runGame: () => void;
  runGameTimestep: () => void;
  newGame: () => void;
  getCanTrain: () => boolean;
  getGamesPlayed: () => Array<number>;
  trainActors: (onProgress: (number) => void, onDone: () => void) => void;
  selectActor: (actorIdx: number, newType: ActorType) => boolean;
  resetActor: (actorIdx: number) => void;
  toggleValueDisplay: (actorIdx: number) => void;
}

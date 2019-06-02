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
  games: number,
  states?: any,
}

export type WorkerMessage = {
  actorMessages: [ActorMessage, ActorMessage],
  grid: Grid,
}

export type OnlineMessage = {
  actorMessages?: [ActorMessage, ActorMessage],
  progress: number,
  done: boolean,
}

export interface Actor {
  type: ActorType;
  sprite: Sprite;
  position: Vector;
  games: number;
  timestep(
    getActions: (number, number) => Array<Action>,
    resetGame: () => void,
    position: Vector,
    targetPosition: Vector
  ): Action;
  serialize(): ActorMessage;
  deserialize(ActorMessage): void;
  reset(): void;
  endGame(): void;
  getValues(Vector): Array<Array<number>> | null;
}

export interface GameBoard {
  grid: Grid;
  actors: [Actor, Actor];
  getValues(): Array<Array<number>> | null;
  run: (onReset: () => void) => void;
  reset(): void;
}

export interface OnlineGameBoard extends GameBoard {
  train(Function, Function): void;
  run: (onReset: () => void) => void;
}

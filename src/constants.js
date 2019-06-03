// @flow
import type { Action, Vector, Sprite } from './types'

export const BOARD = {
  // Game constants
  BOARD_LENGTH: 14, // squares
  MAX_LENGTH: 900, // px
  TREE_DENSITY: 0.15,
}

export const TIME = {
  TICK: 180, // ms
  TRAINING_STEPS: 1000 * 1000, // 10e6 steps
  MAX_EPISODE_LENGTH: 500, // steps
}

export const ACTIONS: { [string]: Action } = {
  NORTH: 'N',
  SOUTH: 'S',
  EAST: 'E',
  WEST: 'W',
}

export const VECTORS: { [Action]: Vector } = {
  N: [-1, 0],
  S: [1, 0],
  E: [0, 1],
  W: [0, -1],
}

export const SPRITES: { [string]: Sprite } = {
  // Sprites
  EMPTY: 0,
  CHICKEN: 1,
  FOX: 2,
  TREE: 3,
}

export const LOGGING = false

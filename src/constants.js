
export default {
  // Game constants
  BOARD_LENGTH: 16, // squares
  MAX_LENGTH: 900,  // px
  TICK: 150,  // ms
  TRAINING_STEPS: 1000 * 1000, // 10e6 steps
  LOGGING: false,
  TREE_DENSITY: 0.15,
  MAX_EPISODE_LENGTH: 500, // steps

  ACTIONS: {
    NORTH: 'NORTH',
    SOUTH: 'SOUTH',
    EAST: 'EAST',
    WEST: 'WEST',
  },

  VECTORS: {
    NORTH: [-1, 0],
    SOUTH: [1, 0],
    EAST: [0, 1],
    WEST: [0, -1],
  },

  // Sprites
  EMPTY: 'EMPTY',
  CHICKEN: 'CHICKEN',
  FOX: 'FOX',
  TREE: 'TREE',

  // Sprite rendering
  SRC_LENGTH: 256, // px
  PADDING: 5, // px
}

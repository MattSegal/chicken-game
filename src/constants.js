
export default {
  // Game constants
  BOARD_LENGTH: 15, // squares
  MAX_LENGTH: 900,  // px
  TICK: 100,  // ms

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

const MOVE_DOWN   = [1, 0]
const MOVE_UP     = [-1, 0]
const MOVE_LEFT   = [0, -1]
const MOVE_RIGHT  = [0, 1]

export default {
  // Game constants
  BOARD_LENGTH: 20, // px
  FOX_TICK: 300,    // ms

  // Moves
  MOVES: {
    ArrowDown: MOVE_DOWN,
    ArrowUp: MOVE_UP,
    ArrowLeft: MOVE_LEFT,
    ArrowRight: MOVE_RIGHT,
    s: MOVE_DOWN,
    w: MOVE_UP,
    a: MOVE_LEFT,
    d: MOVE_RIGHT,
  },

  // Sprites
  EMPTY: ' ',
  PLAYER: '🐓',
  FOX: '🦊',
  WALL: '🌲'
}
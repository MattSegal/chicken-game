import C from 'constants'

// Represents the player/fox on the game board
export default class Actor {
  constructor(sprite, gameboard) {
    this.sprite = sprite
    this.gameboard = gameboard
    this.reset()
  }

  reset() {
    this.row = Math.floor(Math.random() * C.BOARD_LENGTH)
    this.col = Math.floor(Math.random() * C.BOARD_LENGTH)
    this.gameboard.set(this)
  }

  collided(actor) {
    return this.row === actor.row && this.col === actor.col
  }

  move(moveVector) {
    this.gameboard.remove(this)
    this.row += moveVector[0]
    this.col += moveVector[1]
    this.gameboard.set(this)
  }

  canMove(moveVector) {
    return this.gameboard.isValidMove(this, moveVector)
  }
}

import C from 'constants'
import Actor from 'actor'

// Player key press
export const onKeyDown = (player, view) => (event) =>  {
  event.preventDefault()  // Avoid double handling
  const moveVector = C.MOVES[event.key]
  if (moveVector && player.canMove(moveVector)) {
    player.move(moveVector)
    view.render()
  }
}

// Event loop - use A* pathing algo to find a short path to the player
export class FoxLoop {
  constructor(gameboard, fox, player, view) {
    this.gameboard = gameboard
    this.fox = fox
    this.player = player
    this.view = view
  }

  run() {
    let count = 0
    let possible = []
    let seen = []
    let currentSquare = {
      row: this.fox.row, col: this.fox.col,
      score: this.getManhattanDistance(this.fox, this.player),
      steps: 0
    }

    // Search for shortest path
    while (currentSquare.row !== this.player.row || currentSquare.col !== this.player.col) {
      seen.push(currentSquare)
      possible = possible.filter(sq => sq !== currentSquare)
      this.getNextSquares(currentSquare, seen).forEach(sq => possible.push(sq))
      currentSquare = possible.reduce((prev, current) => (prev.score < current.score) ? prev : current)
      count++
      if (count > 500) {
        console.error("TOO MANY ITERATIONS!")
        break
      }
    }

    // Backtrack to find the next move
    while (currentSquare.steps > 1) {
      currentSquare = seen
        .filter(sq => this.getManhattanDistance(sq, currentSquare) === 1)
        .reduce((prev, current) => (prev.steps < current.steps) ? prev : current)
    }

    // TODO: use Actor.move
    this.gameboard.remove(this.fox)
    this.fox.row = currentSquare.row
    this.fox.col = currentSquare.col
    this.gameboard.set(this.fox)

    // Fox catches the player
    if (this.fox.collided(this.player)) {
      this.gameboard.reset()
      this.player.reset()
      this.fox.reset()
    }  
    this.view.render()
  }

  // Get and score all the valid, unseen squares that can be accessed from 'sq'
  getNextSquares(sq, seen) {
    return this.getAdjacentSquares(sq)
    .filter(square => !(seen.some(seenSq => seenSq.row === square.row && seenSq.col === square.col)))
    .filter(square => this.gameboard.isValidPosition(sq.row, sq.col))
    .map(square => ({
      ...square,
      steps: square.steps + 1,
      score: square.steps + 1 + this.getManhattanDistance(square, this.player)
    }))
  }

  // Get the 4 squares adjacent to the given square
  getAdjacentSquares(square) {
    return [
      {...square, row: square.row + 1},
      {...square, row: square.row - 1},
      {...square, col: square.col + 1},
      {...square, col: square.col - 1}
    ]
  }

  // Get the 'Manhatten distance' between 2 squares
  getManhattanDistance(a ,b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
  } 
}

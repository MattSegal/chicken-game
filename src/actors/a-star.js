import Actor from './base'



// Uses A* pathing algorithm to find shortest path to the target
export default class AStarActor extends Actor {
  runPolicy = () => {


    let count = 0
    let possible = []
    let seen = []
    const target = [0, 0]
    let currentSquare = {
      pos: this.pos
      score: this.getManhattanDistance(this.pos, target),
      steps: 0
    }

    // Search for shortest path
    while (currentSquare[0] !== target[0] || currentSquare[1] !== target[1]) {
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



    const action = null
    this.nextAction = action
  }
}


// Get the 'Manhatten distance' between 2 squares
const getManhattanDistance = (posA, posB) => Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1])



  run() {




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

'use strict'

// Game constants
const BOARD_LENGTH = 20
const FOX_TICK = 500 // ms

// Moves
const MOVE_DOWN = [1, 0]
const MOVE_UP = [-1, 0]
const MOVE_LEFT = [0, -1]
const MOVE_RIGHT = [0, 1]
const MOVES = {
  ArrowDown: MOVE_DOWN,
  ArrowUp: MOVE_UP,
  ArrowLeft: MOVE_LEFT,
  ArrowRight: MOVE_RIGHT,
  s: MOVE_DOWN,
  w: MOVE_UP,
  a: MOVE_LEFT,
  d: MOVE_RIGHT,
}

// Sprites
const EMPTY = ' '
const PLAYER = '🐓'
const FOX = '🦊'
const WALL = '🌲'


// Utils
const merge = (a, b) => Object.assign({}, a, b) 

// Represents the player/fox on the game board
function Actor(row, col, sprite) {
  this.row = row
  this.col = col
  this.sprite = sprite
}
Actor.start = function(sprite) {
  const randRow = Math.floor(Math.random() * BOARD_LENGTH)
  const randCol = Math.floor(Math.random() * BOARD_LENGTH)
  return new Actor(randRow, randCol, sprite)
}
Actor.collided = function(actor1, actor2) {
  return actor1.row === actor2.row && actor1.col === actor2.col
} 
Actor.prototype.move = function(moveVector) {
    this.row += moveVector[0]
    this.col += moveVector[1]
}


// Game model singleton
const GameBoard = {
  grid: Array(BOARD_LENGTH).fill(0).map(row => 
    Array(BOARD_LENGTH).fill(0).map(col => Math.random() > 0.2 ? EMPTY : WALL)
  ),
  set:  function(actor) {
    this.grid[actor.row][actor.col] = actor.sprite
  },
  remove: function(actor) {
    this.grid[actor.row][actor.col] = EMPTY
  },
  isInvalidMove: function(position, move) {
    const newRow = position.row + move[0]
    const newCol = position.col + move[1]
    return this.isInvalidPosition(newRow, newCol)
  },
  isInvalidPosition: function(row, col) {
    return (
      row == -1 || row == BOARD_LENGTH || // vertical edge
      col == -1 || col == BOARD_LENGTH || // horizontal edge
      this.grid[row][col] === WALL        // wall collision
    )
  }
}


// View singleton
const View = {
  dom: document.getElementById('gameboard'),
  render: function () {
    // Render GameBoard to the DOM
    this.height = Math.ceil(window.innerHeight / BOARD_LENGTH)
    this.width = Math.ceil(window.innerWidth / BOARD_LENGTH)
    this.dom.innerHTML = GameBoard.grid
      .map(row => this.buildRow(row))
      .reduce((acc, val) => acc + val, '')
  },
  buildRow: function(row) {
    const content = row
      .map(col => this.buildCol(col))
      .reduce((acc, val) => acc + val, '')
    return '<div class="row" style="height:'+this.height+'px;">'+content+'</div>'
  },
  buildCol: function(content) {
    return '<div class="col" style="width:'+this.width+'px;">'+content+'</div>'
  }
}


// Event handlers
function onKeyDown(event) {
  const moveVector = MOVES[event.key]
  if (!moveVector || GameBoard.isInvalidMove(player, moveVector)) {
    return
  }
  event.preventDefault()  // Avoid double handling
  GameBoard.remove(player)
  player.move(moveVector)
  GameBoard.set(player)
  View.render()
}


function onFoxTick() {
  // Use A* pathing algo to find a short path to the player
  const getDistance = (a ,b) =>
    Math.abs(a.row - b.row) + Math.abs(a.col - b.col)

  const getNextSquares = (sq, seen) => {
    return [
      merge(sq, {row: sq.row + 1}), merge(sq, {row: sq.row - 1}),
      merge(sq, {col: sq.col + 1}), merge(sq, {col: sq.col - 1}),
    ]
    .filter(square => !(seen.some(
      seenSq => seenSq.row === square.row && seenSq.col === square.col
    )))
    .filter(square => !GameBoard.isInvalidPosition(sq.row, sq.col))
    .map(square => merge(square, {
      steps: square.steps + 1,
      score: square.steps + 1 + getDistance(square, player)
    }))
  }


  let possible = []
  let seen = []

  const startSquare = {
    row: fox.row, col: fox.col,
    score: getDistance(fox, player),
    steps: 0
  }
  let currentSquare = startSquare

  let count = 0

  // Search for shortest path
  while (currentSquare.row !== player.row || currentSquare.col !== player.col) {
    seen.push(currentSquare)
    possible = possible.filter(sq => sq !== currentSquare)
    const nextSquares = getNextSquares(currentSquare, seen)
    nextSquares.forEach(sq => possible.push(sq))
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
      .filter(sq => getDistance(sq, currentSquare) === 1)
      .reduce((prev, current) => (prev.steps < current.steps) ? prev : current)
    count++
    if (count > 500) {
      console.error("TOO MANY ITERATIONS!")
      break
    }
  }


  GameBoard.remove(fox)
  fox.row = currentSquare.row
  fox.col = currentSquare.col
  GameBoard.set(fox)

  // Fox catches the player
  if (Actor.collided(fox, player)) {
    // do nothing for now
  }  
  View.render()
}



// Initialise game
let player = Actor.start(PLAYER)
let fox = Actor.start(FOX)
GameBoard.set(player)
GameBoard.set(fox)
window.addEventListener('resize', View.render, false);
document.addEventListener('keydown', onKeyDown)
View.render()
setInterval(onFoxTick, FOX_TICK)  // Start the hunt!
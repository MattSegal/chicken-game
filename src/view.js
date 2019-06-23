// @flow
import { BOARD, SPRITES } from './constants'
import { ColorWheel, buildImage, loadImage } from './utils'
import { GameBoard } from './types'

// Sprite
const SRC_LENGTH = 256 // px
const PADDING = 5 // px
const TREE_IMAGE = buildImage('./static/tree.png')
const FOX_IMAGE = buildImage('/static/fox.png')
const CHICKEN_IMAGE = buildImage('./static/chicken.png')
const SPRITE_IMAGES = [TREE_IMAGE, FOX_IMAGE, CHICKEN_IMAGE]

const colorWheel = new ColorWheel(Math.PI / 9, 0.25, 0.9)

// Get canvas and context
// @noflow
const canvas: HTMLCanvasElement = document.getElementById('gameboard')
const ctx = canvas.getContext('2d')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
const onResize = () => {
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
}
window.addEventListener('resize', onResize, false)

export const drawWhenReady = (board: GameBoard) => {
  Promise.all(SPRITE_IMAGES.map(loadImage)).then(() => drawLoop(board))
}

export const drawLoop = (board: GameBoard) => {
  drawGridSquares(board)
  requestAnimationFrame(() => drawLoop(board))
}

const drawGridSquares = (board: GameBoard) => {
  const grid = board.grid
  const valueGrid = null //board.getValueGrid()
  if (valueGrid) drawValueGrid(valueGrid)
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === SPRITES.FOX) {
        drawSprite(FOX_IMAGE, i, j)
      } else if (grid[i][j] === SPRITES.CHICKEN) {
        drawSprite(CHICKEN_IMAGE, i, j)
      } else if (grid[i][j] === SPRITES.TREE) {
        drawSprite(TREE_IMAGE, i, j)
      } else if (!valueGrid) {
        clearSquare(i, j)
      }
    }
  }
}

const drawValueGrid = (values: Array<Array<number>>) => {
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      drawValue(i, j, values[i][j])
    }
  }
}

const drawValue = (row, col, val) => {
  const squareLength = getSquareLength()
  const x = col * squareLength + PADDING
  const y = row * squareLength + PADDING
  const length = squareLength - 2 * PADDING
  ctx.fillStyle = colorWheel.rotate((val * 3 * Math.PI) / 5).asCSS()
  ctx.fillRect(x, y, length, length)
}

const drawSprite = (img: Image, row, col) => {
  const squareLength = getSquareLength()
  const x = col * squareLength + PADDING
  const y = row * squareLength + PADDING
  const length = squareLength - 2 * PADDING
  ctx.drawImage(img, 0, 0, SRC_LENGTH, SRC_LENGTH, x, y, length, length)
}

const clearSquare = (row, col) => {
  const squareLength = getSquareLength()
  const x = col * squareLength
  const y = row * squareLength
  ctx.clearRect(x, y, squareLength, squareLength)
}

const getSquareLength = () => canvas.width / BOARD.BOARD_LENGTH

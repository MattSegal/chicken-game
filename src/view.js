import C from './constants'
import ColorWheel from './colors'

const colorWheel = new ColorWheel(Math.PI / 9, 0.25, 0.9)

const getImage = src => {
  const img = new Image()
  img.src = src
  return img
}
const loadImage = img =>
  new Promise((fulfill, reject) => {
    img.onload = () => fulfill(img)
  })

const treeImage = getImage('./static/tree.png')
const foxImage = getImage('./static/fox.png')
const chickenImage = getImage('./static/chicken.png')

const canvas = document.getElementById('gameboard')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

window.addEventListener(
  'resize',
  () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  },
  false
)

const ctx = canvas.getContext('2d')

export default class View {
  static drawWhenReady(board) {
    View.onImagesLoaded().then(() => View.drawLoop(board))
  }

  static drawLoop(board) {
    View.drawGridSquares(board)
    requestAnimationFrame(() => View.drawLoop(board))
  }

  static onImagesLoaded() {
    return Promise.all([
      loadImage(treeImage),
      loadImage(foxImage),
      loadImage(chickenImage),
    ])
  }

  static getSquareLength() {
    return canvas.width / C.BOARD_LENGTH
  }

  static drawGridSquares(board) {
    const grid = board.grid
    const actorValues = board.getActorValues()
    if (actorValues) {
      for (let i = 0; i < actorValues.length; i++) {
        for (let j = 0; j < actorValues[i].length; j++) {
          View.drawValue(i, j, actorValues[i][j])
        }
      }
    }

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === C.FOX) {
          View.drawSprite(foxImage, i, j)
        } else if (grid[i][j] === C.CHICKEN) {
          View.drawSprite(chickenImage, i, j)
        } else if (grid[i][j] === C.TREE) {
          View.drawSprite(treeImage, i, j)
        } else if (!actorValues) {
          View.clearSquare(i, j)
        }
      }
    }
  }

  static drawValue(row, col, val) {
    const squareLength = View.getSquareLength()
    const x = col * squareLength + C.PADDING
    const y = row * squareLength + C.PADDING
    const length = squareLength - 2 * C.PADDING
    ctx.fillStyle = colorWheel.rotate((val * 3 * Math.PI) / 5).asCSS()
    ctx.fillRect(x, y, length, length)
  }

  static drawSprite(img, row, col) {
    const squareLength = View.getSquareLength()
    const x = col * squareLength + C.PADDING
    const y = row * squareLength + C.PADDING
    const length = squareLength - 2 * C.PADDING
    ctx.drawImage(img, 0, 0, C.SRC_LENGTH, C.SRC_LENGTH, x, y, length, length)
  }

  static clearSquare(row, col) {
    const squareLength = View.getSquareLength()
    const x = col * squareLength
    const y = row * squareLength
    ctx.clearRect(x, y, squareLength, squareLength)
  }
}

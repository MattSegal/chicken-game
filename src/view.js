import C from 'constants'

const getImage =src => {
  const img = new Image();
  img.src = src
  return img
}
const loadImage =img => new Promise((fulfill, reject) => {
  img.onload = () => fulfill(img)
})


const treeImage = getImage('./static/tree.png')
const foxImage = getImage('./static/fox.png')
const chickenImage = getImage('./static/chicken.png')

const canvas = document.getElementById('gameboard')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

window.addEventListener('resize', () => {
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
}, false)

const ctx = canvas.getContext('2d')

export default class View {

  static drawWhenReady(grid) {
    View.onImagesLoaded().then(() => View.drawLoop(grid))
  }

  static drawLoop(grid) {
    View.drawGridSquares(grid)
    requestAnimationFrame(() => View.drawLoop(grid))
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

  static drawGridSquares(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === C.FOX) {
          View.drawSprite(foxImage, i, j)
        } else if (grid[i][j] === C.CHICKEN) {
          View.drawSprite(chickenImage, i, j)
        } else if (grid[i][j] === C.TREE) {
          View.drawSprite(treeImage, i, j)
        } else {
          View.clearSquare(i, j)
        }
      }
    }
  }

  static drawSprite(img, row, col) {
    const squareLength = View.getSquareLength()
    const x = (col * squareLength) + C.PADDING
    const y = (row * squareLength) + C.PADDING
    const length = squareLength - (2 * C.PADDING)
    ctx.drawImage(
      img,
      0, 0, C.SRC_LENGTH, C.SRC_LENGTH,
      x, y, length, length
    )
  }

  static clearSquare(row, col) {
    const squareLength = View.getSquareLength()
    const x = (col * squareLength)
    const y = (row * squareLength)
    ctx.clearRect(x, y, squareLength, squareLength)
  }
}

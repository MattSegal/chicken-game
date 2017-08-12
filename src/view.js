import C from 'constants'

// View singleton
export default class View {
  constructor(gameboard) {
    this.gameboard = gameboard
    this.dom = document.getElementById('gameboard')
  }

  render() {
    // Render GameBoard to the DOM
    this.height = Math.ceil(window.innerHeight / C.BOARD_LENGTH)
    this.width = Math.ceil(window.innerWidth / C.BOARD_LENGTH)
    this.dom.innerHTML = this.gameboard.grid
      .map(row => this.buildRow(row))
      .reduce((acc, val) => acc + val, '')
  }

  buildRow(row) {
    const content = row
      .map(col => this.buildCol(col))
      .reduce((acc, val) => acc + val, '')
    return '<div class="row" style="height:'+this.height+'px;">'+content+'</div>'
  }

  buildCol(content) {
    return '<div class="col" style="width:'+this.width+'px;">'+content+'</div>'
  }
}
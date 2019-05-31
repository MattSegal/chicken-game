// @flow
/*
The ColorWheel allows us to work with colors using
Hue/Saturation/Value (HSV)  and then convert it to 
Red/Green/Blue (RGB) for rendering

HSV: 0 ≤ H < 2PI, 0 ≤ S ≤ 1 and 0 ≤ V ≤ 1:
RGB: 0 ≤ R, G, B ≤ 255
*/

export class ColorWheel {
  hue: number
  sat: number
  val: number
  constructor(hue: number, sat: number, val: number) {
    this.hue = hue
    this.sat = sat
    this.val = val
  }

  // Rotate hue in radians
  rotate(angle: number) {
    const newHue = (2 * Math.PI + this.hue + angle) % (2 * Math.PI)
    return new ColorWheel(newHue, this.sat, this.val)
  }

  // Converts HSV to CSS compatible string
  asCSS() {
    const [red, green, blue] = this.asRGB()
    return `rgb(${red}, ${green}, ${blue})`
  }

  // Converts HSV to RGB
  asRGB(): Array<number> {
    // #1 - calculate inscrutable intermediate values
    const h = this.hue / (Math.PI / 3)
    const c = this.val * this.sat
    const x = c * (1 - Math.abs((h % 2) - 1))
    const o = this.val - c

    // #2 - smash them together
    const idx = Math.floor(h)
    const lookup = this.getHuePrimeLookup(x, c)
    return lookup[idx]
      .map(color => color + o)
      .map(color => Math.round(255 * color))
  }

  getHuePrimeLookup = (x: number, c: number) => [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
    [0, 0, 0],
  ]
}

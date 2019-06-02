// @flow
export const buildImage = (src: string): Image => {
  const img = new Image()
  img.src = src
  return img
}

export const loadImage = (img: Image): Promise<Image> =>
  new Promise((fulfill, reject) => {
    img.onload = () => fulfill(img)
  })

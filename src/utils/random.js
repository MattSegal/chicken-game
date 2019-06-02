// @flow
export function randomChoice<T>(a: Array<T>): T {
  return a[Math.floor(Math.random() * a.length)]
}

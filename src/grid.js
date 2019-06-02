// @flow
import { BOARD, SPRITES } from './constants'
import type { Grid, Sprite } from 'types'

export const create = (): Grid =>
  Array(BOARD.BOARD_LENGTH)
    .fill(0)
    .map(fillRow)

export const copy = (grid: Grid): Grid => grid.map(r => r.map(c => c))

const fillCol = (): Sprite =>
  Math.random() > BOARD.TREE_DENSITY ? SPRITES.EMPTY : SPRITES.TREE

const fillRow = () =>
  Array(BOARD.BOARD_LENGTH)
    .fill(0)
    .map(fillCol)

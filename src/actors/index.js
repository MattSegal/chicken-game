// @flow
import { SPRITES } from '../constants'
import PlayerActor from './player'
import GreedyActor from './greedy'
import RandomActor from './random'
import AStarActor from './a-star'
import TemporalDifferenceActor from './temporal-difference'
// import MonteCarloActor from './monte-carlo'
import type { ActorType, Actor } from '../types'

export const CHICKEN_ALGOS: { [ActorType]: string } = {
  CHICKEN_TEMPORAL_DIFFERENCE: 'temporal difference',
  // CHICKEN_MONTE_CARLO: 'monte carlo',
  CHICKEN_RANDOM: 'random',
  CHICKEN_GREEDY: 'greedy',
  CHICKEN_PLAYER: 'player',
}

export const FOX_ALGOS: { [ActorType]: string } = {
  FOX_GREEDY: 'greedy',
  FOX_TEMPORAL_DIFFERENCE: 'temporal difference',
  // MONTE_CARLO: 'monte carlo',
  FOX_RANDOM: 'random',
  FOX_PLAYER: 'player',
  FOX_A_STAR: 'a* search',
}

export const buildActor = (type: ActorType): Actor => {
  switch (type) {
    // case 'CHICKEN_MONTE_CARLO':
    // return new MonteCarloActor(SPRITES.CHICKEN, type)
    // case 'FOX_MONTE_CARLO':
    // return new MonteCarloActor(SPRITES.FOX, type)
    case 'CHICKEN_TEMPORAL_DIFFERENCE':
      return new TemporalDifferenceActor(SPRITES.CHICKEN, type)
    case 'FOX_TEMPORAL_DIFFERENCE':
      return new TemporalDifferenceActor(SPRITES.FOX, type)
    case 'CHICKEN_RANDOM':
      return new RandomActor(SPRITES.CHICKEN, type)
    case 'FOX_RANDOM':
      return new RandomActor(SPRITES.FOX, type)
    case 'FOX_GREEDY':
      return new GreedyActor(SPRITES.FOX, type)
    case 'CHICKEN_GREEDY':
      return new GreedyActor(SPRITES.CHICKEN, type)
    case 'CHICKEN_PLAYER':
      return new PlayerActor(SPRITES.CHICKEN, type)
    case 'FOX_PLAYER':
      return new PlayerActor(SPRITES.FOX, type)
    case 'FOX_A_STAR':
      return new AStarActor(SPRITES.FOX, type)
    default:
      throw Error(`Actor type ${type} not recognized`)
  }
}

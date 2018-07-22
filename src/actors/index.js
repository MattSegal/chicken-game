import C from '../constants'
import PlayerActor from './player'
import GreedyActor from './greedy'
import RandomActor from './random'
import AStarActor from './a-star'
import TemporalDifferenceActor from './temporal-difference'
import MonteCarloActor from './monte-carlo'

// TODO: Fix monte carlo
const CHICKEN_ALGOS = {
  RANDOM: 'random',
  TEMPORAL_DIFFERENCE: 'temporal difference',
  // MONTE_CARLO: 'monte carlo',
  GREEDY: 'greedy flight',
  PLAYER: 'player',
}

const FOX_ALGOS = {
  // MONTE_CARLO: 'monte carlo',
  TEMPORAL_DIFFERENCE: 'temporal difference',
  A_STAR: 'a* search',
  GREEDY: 'greedy pursuit',
  RANDOM: 'random',
  PLAYER: 'player',
}

const LEARNING_ALGOS = ['temporal difference']

const chickenActors = {}
const foxActors = {}

const getChickenActor = algo => {
  const cachedActor = chickenActors[algo]
  if (cachedActor) {
    return cachedActor
  } else {
    const newActor = buildChickenActor(algo)
    newActor.type = algo
    chickenActors[algo] = newActor
    return newActor
  }
}

const getFoxActor = algo => {
  const cachedActor = foxActors[algo]
  if (cachedActor) {
    return cachedActor
  } else {
    const newActor = buildFoxActor(algo)
    newActor.type = algo
    foxActors[algo] = newActor
    return newActor
  }
}

const buildChickenActor = algo => {
  switch(algo) {
    case CHICKEN_ALGOS.TEMPORAL_DIFFERENCE:
      return (new TemporalDifferenceActor(C.CHICKEN)).flee()
    case CHICKEN_ALGOS.MONTE_CARLO:
      return (new MonteCarloActor(C.CHICKEN)).flee()
    case CHICKEN_ALGOS.RANDOM:
      return new RandomActor(C.CHICKEN)
    case CHICKEN_ALGOS.PLAYER:
      return new PlayerActor(C.CHICKEN)
    case CHICKEN_ALGOS.GREEDY:
      return (new GreedyActor(C.CHICKEN)).flee()
    default:
      throw Error(`Algorithm ${algo} not recognized for chicken`)
  }
}

const buildFoxActor = algo => {
  switch(algo) {
    case FOX_ALGOS.TEMPORAL_DIFFERENCE:
      return (new TemporalDifferenceActor(C.FOX)).follow()
    case FOX_ALGOS.MONTE_CARLO:
      return (new MonteCarloActor(C.FOX)).follow()
    case FOX_ALGOS.A_STAR:
      return new AStarActor(C.FOX)
    case FOX_ALGOS.RANDOM:
      return new RandomActor(C.FOX)
    case FOX_ALGOS.PLAYER:
      return new PlayerActor(C.FOX)
    case FOX_ALGOS.GREEDY:
      return (new GreedyActor(C.FOX)).follow()
    default:
      throw Error(`Algorithm ${algo} not recognized for fox`)
  }
}

module.exports = {
  LEARNING_ALGOS,
  CHICKEN_ALGOS,
  FOX_ALGOS,
  getFoxActor,
  getChickenActor,
  buildChickenActor,
  buildFoxActor,
}

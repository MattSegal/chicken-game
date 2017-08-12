'use strict'
import C from 'constants'
import Actor from 'actor'
import GameBoard from 'gameboard'
import View from 'view'
import {onKeyDown, FoxLoop} from 'events'

// Initialise game board and view
const gameboard = new GameBoard()
const player = new Actor(C.PLAYER, gameboard)
const fox = new Actor(C.FOX, gameboard)
const view = new View(gameboard)
const foxLoop = new FoxLoop(gameboard, fox, player, view)
view.render()

// Hook up events
window.addEventListener('resize', view.render, false);
document.addEventListener('keydown', onKeyDown(player, view))
setInterval(() => foxLoop.run(), C.FOX_TICK)  // Start the hunt!

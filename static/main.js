/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	// Game constants

	var BOARD_LENGTH = 20;
	var FOX_TICK = 300; // ms

	// Moves
	var MOVE_DOWN = [1, 0];
	var MOVE_UP = [-1, 0];
	var MOVE_LEFT = [0, -1];
	var MOVE_RIGHT = [0, 1];
	var MOVES = {
	  ArrowDown: MOVE_DOWN,
	  ArrowUp: MOVE_UP,
	  ArrowLeft: MOVE_LEFT,
	  ArrowRight: MOVE_RIGHT,
	  s: MOVE_DOWN,
	  w: MOVE_UP,
	  a: MOVE_LEFT,
	  d: MOVE_RIGHT

	  // Sprites
	};var EMPTY = ' ';
	var PLAYER = '🐓';
	var FOX = '🦊';
	var WALL = '🌲';

	// Utils
	var merge = function merge(a, b) {
	  return Object.assign({}, a, b);
	};

	// Represents the player/fox on the game board
	function Actor(row, col, sprite) {
	  this.row = row;
	  this.col = col;
	  this.sprite = sprite;
	}
	Actor.start = function (sprite) {
	  var randRow = Math.floor(Math.random() * BOARD_LENGTH);
	  var randCol = Math.floor(Math.random() * BOARD_LENGTH);
	  return new Actor(randRow, randCol, sprite);
	};
	Actor.collided = function (actor1, actor2) {
	  return actor1.row === actor2.row && actor1.col === actor2.col;
	};
	Actor.prototype.move = function (moveVector) {
	  this.row += moveVector[0];
	  this.col += moveVector[1];
	};

	// Game model singleton
	var GameBoard = {
	  init: function init() {
	    this.grid = Array(BOARD_LENGTH).fill(0).map(function (row) {
	      return Array(BOARD_LENGTH).fill(0).map(function (col) {
	        return Math.random() > 0.2 ? EMPTY : WALL;
	      });
	    });
	  },
	  set: function set(actor) {
	    this.grid[actor.row][actor.col] = actor.sprite;
	  },
	  remove: function remove(actor) {
	    this.grid[actor.row][actor.col] = EMPTY;
	  },
	  isInvalidMove: function isInvalidMove(position, move) {
	    var newRow = position.row + move[0];
	    var newCol = position.col + move[1];
	    return this.isInvalidPosition(newRow, newCol);
	  },
	  isInvalidPosition: function isInvalidPosition(row, col) {
	    return row == -1 || row == BOARD_LENGTH || // vertical edge
	    col == -1 || col == BOARD_LENGTH || // horizontal edge
	    this.grid[row][col] === WALL // wall collision
	    ;
	  }

	  // View singleton
	};var View = {
	  dom: document.getElementById('gameboard'),
	  render: function render() {
	    var _this = this;

	    // Render GameBoard to the DOM
	    this.height = Math.ceil(window.innerHeight / BOARD_LENGTH);
	    this.width = Math.ceil(window.innerWidth / BOARD_LENGTH);
	    this.dom.innerHTML = GameBoard.grid.map(function (row) {
	      return _this.buildRow(row);
	    }).reduce(function (acc, val) {
	      return acc + val;
	    }, '');
	  },
	  buildRow: function buildRow(row) {
	    var _this2 = this;

	    var content = row.map(function (col) {
	      return _this2.buildCol(col);
	    }).reduce(function (acc, val) {
	      return acc + val;
	    }, '');
	    return '<div class="row" style="height:' + this.height + 'px;">' + content + '</div>';
	  },
	  buildCol: function buildCol(content) {
	    return '<div class="col" style="width:' + this.width + 'px;">' + content + '</div>';
	  }

	  // Event handlers
	};function onKeyDown(event) {
	  var moveVector = MOVES[event.key];
	  if (!moveVector || GameBoard.isInvalidMove(player, moveVector)) {
	    return;
	  }
	  event.preventDefault(); // Avoid double handling
	  GameBoard.remove(player);
	  player.move(moveVector);
	  GameBoard.set(player);
	  View.render();
	}

	function onFoxTick() {
	  // Use A* pathing algo to find a short path to the player
	  var getDistance = function getDistance(a, b) {
	    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
	  };

	  var getNextSquares = function getNextSquares(sq, seen) {
	    return [merge(sq, { row: sq.row + 1 }), merge(sq, { row: sq.row - 1 }), merge(sq, { col: sq.col + 1 }), merge(sq, { col: sq.col - 1 })].filter(function (square) {
	      return !seen.some(function (seenSq) {
	        return seenSq.row === square.row && seenSq.col === square.col;
	      });
	    }).filter(function (square) {
	      return !GameBoard.isInvalidPosition(sq.row, sq.col);
	    }).map(function (square) {
	      return merge(square, {
	        steps: square.steps + 1,
	        score: square.steps + 1 + getDistance(square, player)
	      });
	    });
	  };

	  var possible = [];
	  var seen = [];

	  var startSquare = {
	    row: fox.row, col: fox.col,
	    score: getDistance(fox, player),
	    steps: 0
	  };
	  var currentSquare = startSquare;

	  var count = 0;

	  // Search for shortest path
	  while (currentSquare.row !== player.row || currentSquare.col !== player.col) {
	    seen.push(currentSquare);
	    possible = possible.filter(function (sq) {
	      return sq !== currentSquare;
	    });
	    var nextSquares = getNextSquares(currentSquare, seen);
	    nextSquares.forEach(function (sq) {
	      return possible.push(sq);
	    });
	    currentSquare = possible.reduce(function (prev, current) {
	      return prev.score < current.score ? prev : current;
	    });
	    count++;
	    if (count > 500) {
	      console.error("TOO MANY ITERATIONS!");
	      break;
	    }
	  }
	  // Backtrack to find the next move
	  while (currentSquare.steps > 1) {
	    currentSquare = seen.filter(function (sq) {
	      return getDistance(sq, currentSquare) === 1;
	    }).reduce(function (prev, current) {
	      return prev.steps < current.steps ? prev : current;
	    });
	  }

	  GameBoard.remove(fox);
	  fox.row = currentSquare.row;
	  fox.col = currentSquare.col;
	  GameBoard.set(fox);

	  // Fox catches the player
	  if (Actor.collided(fox, player)) {
	    // re initialise
	    GameBoard.init();
	    player = Actor.start(PLAYER);
	    fox = Actor.start(FOX);
	    GameBoard.set(player);
	    GameBoard.set(fox);
	  }
	  View.render();
	}

	// Initialise game
	GameBoard.init();
	var player = Actor.start(PLAYER);
	var fox = Actor.start(FOX);
	GameBoard.set(player);
	GameBoard.set(fox);
	View.render();
	window.addEventListener('resize', View.render, false);
	document.addEventListener('keydown', onKeyDown);
	setInterval(onFoxTick, FOX_TICK); // Start the hunt!

/***/ })
/******/ ]);
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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	var _actor = __webpack_require__(2);

	var _actor2 = _interopRequireDefault(_actor);

	var _gameboard = __webpack_require__(3);

	var _gameboard2 = _interopRequireDefault(_gameboard);

	var _view = __webpack_require__(4);

	var _view2 = _interopRequireDefault(_view);

	var _events = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Initialise game board and view
	var gameboard = new _gameboard2.default();
	var player = new _actor2.default(_constants2.default.PLAYER, gameboard);
	var fox = new _actor2.default(_constants2.default.FOX, gameboard);
	var view = new _view2.default(gameboard);
	var foxLoop = new _events.FoxLoop(gameboard, fox, player, view);
	view.render();

	// Hook up events
	window.addEventListener('resize', view.render, false);
	document.addEventListener('keydown', (0, _events.onKeyDown)(player, view));
	setInterval(function () {
	  return foxLoop.run();
	}, _constants2.default.FOX_TICK); // Start the hunt!

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var MOVE_DOWN = [1, 0];
	var MOVE_UP = [-1, 0];
	var MOVE_LEFT = [0, -1];
	var MOVE_RIGHT = [0, 1];

	exports.default = {
	  // Game constants
	  BOARD_LENGTH: 20, // squares
	  MAX_LENGTH: 900, // px
	  FOX_TICK: 300, // ms

	  // Moves
	  MOVES: {
	    ArrowDown: MOVE_DOWN,
	    ArrowUp: MOVE_UP,
	    ArrowLeft: MOVE_LEFT,
	    ArrowRight: MOVE_RIGHT,
	    s: MOVE_DOWN,
	    w: MOVE_UP,
	    a: MOVE_LEFT,
	    d: MOVE_RIGHT
	  },

	  // Sprites
	  EMPTY: ' ',
	  PLAYER: '🐓',
	  FOX: '🦊',
	  WALL: '🌲'
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Represents the player/fox on the game board
	var Actor = function () {
	  function Actor(sprite, gameboard) {
	    _classCallCheck(this, Actor);

	    this.sprite = sprite;
	    this.gameboard = gameboard;
	    this.reset();
	  }

	  _createClass(Actor, [{
	    key: 'reset',
	    value: function reset() {
	      this.row = Math.floor(Math.random() * _constants2.default.BOARD_LENGTH);
	      this.col = Math.floor(Math.random() * _constants2.default.BOARD_LENGTH);
	      this.gameboard.set(this);
	    }
	  }, {
	    key: 'collided',
	    value: function collided(actor) {
	      return this.row === actor.row && this.col === actor.col;
	    }
	  }, {
	    key: 'move',
	    value: function move(moveVector) {
	      this.gameboard.remove(this);
	      this.row += moveVector[0];
	      this.col += moveVector[1];
	      this.gameboard.set(this);
	    }
	  }, {
	    key: 'canMove',
	    value: function canMove(moveVector) {
	      return this.gameboard.isValidMove(this, moveVector);
	    }
	  }]);

	  return Actor;
	}();

	exports.default = Actor;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Game model singleton
	var GameBoard = function () {
	  function GameBoard() {
	    _classCallCheck(this, GameBoard);

	    this.reset();
	  }

	  _createClass(GameBoard, [{
	    key: 'reset',
	    value: function reset() {
	      this.grid = Array(_constants2.default.BOARD_LENGTH).fill(0).map(function (row) {
	        return Array(_constants2.default.BOARD_LENGTH).fill(0).map(function (col) {
	          return Math.random() > 0.2 ? _constants2.default.EMPTY : _constants2.default.WALL;
	        });
	      });
	    }
	  }, {
	    key: 'set',
	    value: function set(actor) {
	      this.grid[actor.row][actor.col] = actor.sprite;
	    }
	  }, {
	    key: 'remove',
	    value: function remove(actor) {
	      this.grid[actor.row][actor.col] = _constants2.default.EMPTY;
	    }
	  }, {
	    key: 'isValidMove',
	    value: function isValidMove(actor, move) {
	      var newRow = actor.row + move[0];
	      var newCol = actor.col + move[1];
	      return this.isValidPosition(newRow, newCol);
	    }
	  }, {
	    key: 'isValidPosition',
	    value: function isValidPosition(row, col) {
	      return !(row === -1 || row === _constants2.default.BOARD_LENGTH || // vertical edge
	      col === -1 || col === _constants2.default.BOARD_LENGTH || // horizontal edge
	      this.grid[row][col] === _constants2.default.WALL // wall collision
	      );
	    }
	  }]);

	  return GameBoard;
	}();

	exports.default = GameBoard;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// View singleton
	var View = function () {
	  function View(gameboard) {
	    _classCallCheck(this, View);

	    this.gameboard = gameboard;
	    this.dom = document.getElementById('gameboard');
	  }

	  _createClass(View, [{
	    key: 'render',
	    value: function render() {
	      var _this = this;

	      // Render GameBoard to the DOM
	      var boardHeight = window.innerHeight > _constants2.default.MAX_LENGTH ? _constants2.default.MAX_LENGTH : window.innerHeight;
	      var boardWidth = window.innerWidth > _constants2.default.MAX_LENGTH ? _constants2.default.MAX_LENGTH : window.innerWidth;
	      this.height = Math.ceil(boardHeight / _constants2.default.BOARD_LENGTH);
	      this.width = Math.ceil(boardWidth / _constants2.default.BOARD_LENGTH);
	      this.dom.innerHTML = this.gameboard.grid.map(function (row) {
	        return _this.buildRow(row);
	      }).reduce(function (acc, val) {
	        return acc + val;
	      }, '');
	    }
	  }, {
	    key: 'buildRow',
	    value: function buildRow(row) {
	      var _this2 = this;

	      var content = row.map(function (col) {
	        return _this2.buildCol(col);
	      }).reduce(function (acc, val) {
	        return acc + val;
	      }, '');
	      return '<div class="row" style="height:' + this.height + 'px;">' + content + '</div>';
	    }
	  }, {
	    key: 'buildCol',
	    value: function buildCol(content) {
	      return '<div class="col" style="width:' + this.width + 'px;">' + content + '</div>';
	    }
	  }]);

	  return View;
	}();

	exports.default = View;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FoxLoop = exports.onKeyDown = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	var _actor = __webpack_require__(2);

	var _actor2 = _interopRequireDefault(_actor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Player key press
	var onKeyDown = exports.onKeyDown = function onKeyDown(player, view) {
	  return function (event) {
	    event.preventDefault(); // Avoid double handling
	    var moveVector = _constants2.default.MOVES[event.key];
	    if (moveVector && player.canMove(moveVector)) {
	      player.move(moveVector);
	      view.render();
	    }
	  };
	};

	// Event loop - use A* pathing algo to find a short path to the player

	var FoxLoop = exports.FoxLoop = function () {
	  function FoxLoop(gameboard, fox, player, view) {
	    _classCallCheck(this, FoxLoop);

	    this.gameboard = gameboard;
	    this.fox = fox;
	    this.player = player;
	    this.view = view;
	  }

	  _createClass(FoxLoop, [{
	    key: 'run',
	    value: function run() {
	      var _this = this;

	      var count = 0;
	      var possible = [];
	      var seen = [];
	      var currentSquare = {
	        row: this.fox.row, col: this.fox.col,
	        score: this.getManhattanDistance(this.fox, this.player),
	        steps: 0

	        // Search for shortest path
	      };while (currentSquare.row !== this.player.row || currentSquare.col !== this.player.col) {
	        seen.push(currentSquare);
	        possible = possible.filter(function (sq) {
	          return sq !== currentSquare;
	        });
	        this.getNextSquares(currentSquare, seen).forEach(function (sq) {
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
	          return _this.getManhattanDistance(sq, currentSquare) === 1;
	        }).reduce(function (prev, current) {
	          return prev.steps < current.steps ? prev : current;
	        });
	      }

	      // TODO: use Actor.move
	      this.gameboard.remove(this.fox);
	      this.fox.row = currentSquare.row;
	      this.fox.col = currentSquare.col;
	      this.gameboard.set(this.fox);

	      // Fox catches the player
	      if (this.fox.collided(this.player)) {
	        this.gameboard.reset();
	        this.player.reset();
	        this.fox.reset();
	      }
	      this.view.render();
	    }

	    // Get and score all the valid, unseen squares that can be accessed from 'sq'

	  }, {
	    key: 'getNextSquares',
	    value: function getNextSquares(sq, seen) {
	      var _this2 = this;

	      return this.getAdjacentSquares(sq).filter(function (square) {
	        return !seen.some(function (seenSq) {
	          return seenSq.row === square.row && seenSq.col === square.col;
	        });
	      }).filter(function (square) {
	        return _this2.gameboard.isValidPosition(sq.row, sq.col);
	      }).map(function (square) {
	        return _extends({}, square, {
	          steps: square.steps + 1,
	          score: square.steps + 1 + _this2.getManhattanDistance(square, _this2.player)
	        });
	      });
	    }

	    // Get the 4 squares adjacent to the given square

	  }, {
	    key: 'getAdjacentSquares',
	    value: function getAdjacentSquares(square) {
	      return [_extends({}, square, { row: square.row + 1 }), _extends({}, square, { row: square.row - 1 }), _extends({}, square, { col: square.col + 1 }), _extends({}, square, { col: square.col - 1 })];
	    }

	    // Get the 'Manhatten distance' between 2 squares

	  }, {
	    key: 'getManhattanDistance',
	    value: function getManhattanDistance(a, b) {
	      return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
	    }
	  }]);

	  return FoxLoop;
	}();

/***/ })
/******/ ]);
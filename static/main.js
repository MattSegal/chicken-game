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

	var _view = __webpack_require__(2);

	var _view2 = _interopRequireDefault(_view);

	var _gameboard = __webpack_require__(3);

	var _gameboard2 = _interopRequireDefault(_gameboard);

	var _player = __webpack_require__(4);

	var _player2 = _interopRequireDefault(_player);

	var _random = __webpack_require__(6);

	var _random2 = _interopRequireDefault(_random);

	var _aStar = __webpack_require__(7);

	var _aStar2 = _interopRequireDefault(_aStar);

	var _temporalDifference = __webpack_require__(8);

	var _temporalDifference2 = _interopRequireDefault(_temporalDifference);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Initialize board
	var board = new _gameboard2.default();

	// Draw grid
	_view2.default.drawWhenReady(board.grid);

	// Create actors
	var chicken = new _temporalDifference2.default('chicken', _constants2.default.CHICKEN, board);
	var fox = new _aStar2.default('fox', _constants2.default.FOX, board);
	fox.addTarget(chicken);
	chicken.addTarget(fox);

	// Run the game
	board.runIters(500 * 1000);
	board.runInterval();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  // Game constants
	  BOARD_LENGTH: 15, // squares
	  MAX_LENGTH: 900, // px
	  TICK: 100, // ms

	  ACTIONS: {
	    NORTH: 'NORTH',
	    SOUTH: 'SOUTH',
	    EAST: 'EAST',
	    WEST: 'WEST'
	  },

	  VECTORS: {
	    NORTH: [-1, 0],
	    SOUTH: [1, 0],
	    EAST: [0, 1],
	    WEST: [0, -1]
	  },

	  // Sprites
	  EMPTY: 'EMPTY',
	  CHICKEN: 'CHICKEN',
	  FOX: 'FOX',
	  TREE: 'TREE',

	  // Sprite rendering
	  SRC_LENGTH: 256, // px
	  PADDING: 5 // px
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

	var getImage = function getImage(src) {
	  var img = new Image();
	  img.src = src;
	  return img;
	};
	var loadImage = function loadImage(img) {
	  return new Promise(function (fulfill, reject) {
	    img.onload = function () {
	      return fulfill(img);
	    };
	  });
	};

	var treeImage = getImage('./static/tree.png');
	var foxImage = getImage('./static/fox.png');
	var chickenImage = getImage('./static/chicken.png');

	var canvas = document.getElementById('gameboard');
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	window.addEventListener('resize', function () {
	  canvas.width = canvas.clientWidth;
	  canvas.height = canvas.clientHeight;
	}, false);

	var ctx = canvas.getContext('2d');

	var View = function () {
	  function View() {
	    _classCallCheck(this, View);
	  }

	  _createClass(View, null, [{
	    key: 'drawWhenReady',
	    value: function drawWhenReady(grid) {
	      View.onImagesLoaded().then(function () {
	        return View.drawLoop(grid);
	      });
	    }
	  }, {
	    key: 'drawLoop',
	    value: function drawLoop(grid) {
	      View.drawGridSquares(grid);
	      requestAnimationFrame(function () {
	        return View.drawLoop(grid);
	      });
	    }
	  }, {
	    key: 'onImagesLoaded',
	    value: function onImagesLoaded() {
	      return Promise.all([loadImage(treeImage), loadImage(foxImage), loadImage(chickenImage)]);
	    }
	  }, {
	    key: 'getSquareLength',
	    value: function getSquareLength() {
	      return canvas.width / _constants2.default.BOARD_LENGTH;
	    }
	  }, {
	    key: 'drawGridSquares',
	    value: function drawGridSquares(grid) {
	      for (var i = 0; i < grid.length; i++) {
	        for (var j = 0; j < grid[i].length; j++) {
	          if (grid[i][j] === _constants2.default.CHICKEN) {
	            View.drawSprite(chickenImage, i, j);
	          } else if (grid[i][j] === _constants2.default.FOX) {
	            View.drawSprite(foxImage, i, j);
	          } else if (grid[i][j] === _constants2.default.TREE) {
	            View.drawSprite(treeImage, i, j);
	          } else {
	            View.clearSquare(i, j);
	          }
	        }
	      }
	    }
	  }, {
	    key: 'drawSprite',
	    value: function drawSprite(img, row, col) {
	      var squareLength = View.getSquareLength();
	      var x = col * squareLength + _constants2.default.PADDING;
	      var y = row * squareLength + _constants2.default.PADDING;
	      var length = squareLength - 2 * _constants2.default.PADDING;
	      ctx.drawImage(img, 0, 0, _constants2.default.SRC_LENGTH, _constants2.default.SRC_LENGTH, x, y, length, length);
	    }
	  }, {
	    key: 'clearSquare',
	    value: function clearSquare(row, col) {
	      var squareLength = View.getSquareLength();
	      var x = col * squareLength;
	      var y = row * squareLength;
	      ctx.clearRect(x, y, squareLength, squareLength);
	    }
	  }]);

	  return View;
	}();

	exports.default = View;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var fillCol = function fillCol() {
	  return Math.random() > 0.2 ? _constants2.default.EMPTY : _constants2.default.TREE;
	};
	var fillRow = function fillRow() {
	  return Array(_constants2.default.BOARD_LENGTH).fill(0).map(fillCol);
	};

	// Game model singleton

	var GameBoard = function GameBoard() {
	  var _this = this;

	  _classCallCheck(this, GameBoard);

	  this.setupGrid = function () {
	    _this.grid = Array(_constants2.default.BOARD_LENGTH).fill(0).map(fillRow);
	  };

	  this.addActor = function (actor) {
	    if (!_this.actors.includes(actor)) {
	      _this.actors.push(actor);
	      _this.setActorPosition(actor);
	    }
	  };

	  this.moveActors = function () {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = _this.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var actor = _step.value;

	        actor.timestep();
	        var action = actor.nextAction;
	        actor.nextAction = null;
	        if (action) {
	          _this.clearPosition(actor.pos);
	          actor.pos[0] += _constants2.default.VECTORS[action][0];
	          actor.pos[1] += _constants2.default.VECTORS[action][1];
	          _this.setActorPosition(actor);
	        }
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  };

	  this.setActorPosition = function (actor) {
	    _this.grid[actor.pos[0]][actor.pos[1]] = actor.value;
	  };

	  this.clearPosition = function (pos) {
	    _this.grid[pos[0]][pos[1]] = _constants2.default.EMPTY;
	  };

	  this.getActions = function (row, col) {
	    var actions = [];
	    var max = _constants2.default.BOARD_LENGTH - 1;
	    if (row < 0 || col < 0 || col > max || row > max) return actions;
	    row > 0 && _this.grid[row - 1][col] !== _constants2.default.TREE && actions.push(_constants2.default.ACTIONS.NORTH);
	    row < max && _this.grid[row + 1][col] !== _constants2.default.TREE && actions.push(_constants2.default.ACTIONS.SOUTH);
	    col > 0 && _this.grid[row][col - 1] !== _constants2.default.TREE && actions.push(_constants2.default.ACTIONS.WEST);
	    col < max && _this.grid[row][col + 1] !== _constants2.default.TREE && actions.push(_constants2.default.ACTIONS.EAST);
	    return actions;
	  };

	  this.runInterval = function () {
	    _this.timerId = setInterval(function () {
	      return _this.run(_this.resetInterval);
	    }, _constants2.default.TICK);
	  };

	  this.resetInterval = function () {
	    clearInterval(_this.timerId);
	    _this.reset();
	    _this.runInterval();
	  };

	  this.runIters = function (iters) {
	    for (var i = 0; i < iters; i++) {
	      _this.run(_this.reset);
	    }
	    console.warn('END');
	  };

	  this.reset = function () {
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	      for (var _iterator2 = _this.actors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var actor = _step2.value;

	        _this.grid[actor.pos[0]][actor.pos[1]] = _constants2.default.EMPTY;
	        actor.reset();
	        _this.setActorPosition(actor);
	      }
	    } catch (err) {
	      _didIteratorError2 = true;
	      _iteratorError2 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	          _iterator2.return();
	        }
	      } finally {
	        if (_didIteratorError2) {
	          throw _iteratorError2;
	        }
	      }
	    }
	  };

	  this.run = function (reset) {
	    _this.moveActors();
	    if (samePosition(_this.actors[0], _this.actors[1])) {
	      // Game over
	      reset();
	      _this.numGames++;
	    }
	  };

	  this.actors = [];
	  this.setupGrid();
	  this.timerId = null;
	  this.numGames = 0;
	};

	exports.default = GameBoard;


	var sameRow = function sameRow(sqA, sqB) {
	  return sqA.pos[0] === sqB.pos[0];
	};

	var sameCol = function sameCol(sqA, sqB) {
	  return sqA.pos[1] === sqB.pos[1];
	};

	var samePosition = function samePosition(sqA, sqB) {
	  return sameRow(sqA, sqB) && sameCol(sqA, sqB);
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(5);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MOVES = {
	  ArrowDown: 'SOUTH',
	  ArrowUp: 'NORTH',
	  ArrowLeft: 'WEST',
	  ArrowRight: 'EAST',
	  s: 'SOUTH',
	  w: 'NORTH',
	  a: 'WEST',
	  d: 'EAST'

	  // Allows player to control the actor
	};
	var PlayerActor = function (_Actor) {
	  _inherits(PlayerActor, _Actor);

	  function PlayerActor(name, value, board) {
	    _classCallCheck(this, PlayerActor);

	    var _this = _possibleConstructorReturn(this, (PlayerActor.__proto__ || Object.getPrototypeOf(PlayerActor)).call(this, name, value, board));

	    document.addEventListener('keydown', function (e) {
	      var nextAction = MOVES[e.key] || null;
	      var actions = _this.getActions();
	      if (actions.includes(nextAction)) {
	        _this.nextAction = nextAction;
	      }
	    });
	    return _this;
	  }

	  _createClass(PlayerActor, [{
	    key: 'timestep',
	    value: function timestep() {
	      // Do nothing
	    }
	  }]);

	  return PlayerActor;
	}(_base2.default);

	exports.default = PlayerActor;

/***/ }),
/* 5 */
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

	var randomScalar = function randomScalar() {
	  return Math.floor(Math.random() * _constants2.default.BOARD_LENGTH);
	};
	var randomPosition = function randomPosition() {
	  return [randomScalar(), randomScalar()];
	};

	// Represents the chicken/fox on the game board

	var Actor = function () {
	  function Actor(name, value, board) {
	    var _this = this;

	    _classCallCheck(this, Actor);

	    this.addTarget = function (target) {
	      _this.target = target;
	    };

	    this.getActions = function () {
	      return _this.board.getActions(_this.pos[0], _this.pos[1]);
	    };

	    this.name = name;
	    this.value = value;
	    this.nextAction = null;
	    this.board = board;
	    this.reset();
	  }

	  _createClass(Actor, [{
	    key: 'timestep',
	    value: function timestep() {
	      // Perform all actions for this timestep
	      // To be implemented by child class
	    }
	  }, {
	    key: 'getReward',
	    value: function getReward() {
	      // Get the reward for this time-step
	      return 0;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var isEmpty = false;
	      while (!isEmpty) {
	        this.pos = randomPosition();
	        if (this.board.grid[this.pos[0]][this.pos[1]] === _constants2.default.EMPTY) {
	          isEmpty = true;
	        }
	      }
	      this.board.addActor(this);
	    }
	  }], [{
	    key: 'getManhattanDistance',


	    // Get the 'Manhatten distance' between 2 actors
	    value: function getManhattanDistance(posA, posB) {
	      return Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1]);
	    }

	    // Get new position given a current position and an action

	  }, {
	    key: 'getNewPosition',
	    value: function getNewPosition(action, oldPosition) {
	      return [oldPosition[0] + _constants2.default.VECTORS[action][0], oldPosition[1] + _constants2.default.VECTORS[action][1]];
	    }

	    // Get action given current position and new position

	  }, {
	    key: 'getActionFromPositions',
	    value: function getActionFromPositions(start, end) {
	      if (end[0] === start[0] + 1 && end[1] === start[1]) {
	        return _constants2.default.ACTIONS.SOUTH;
	      } else if (end[0] === start[0] - 1 && end[1] === start[1]) {
	        return _constants2.default.ACTIONS.NORTH;
	      } else if (end[0] === start[0] && end[1] === start[1] + 1) {
	        return _constants2.default.ACTIONS.EAST;
	      } else if (end[0] === start[0] && end[1] === start[1] - 1) {
	        return _constants2.default.ACTIONS.WEST;
	      }
	      return null;
	    }
	  }, {
	    key: 'samePosition',
	    value: function samePosition(posA, posB) {
	      return posA[0] == posB[0] && posA[1] == posB[1];
	    }
	  }]);

	  return Actor;
	}();

	exports.default = Actor;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _base = __webpack_require__(5);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Totally random actor
	var RandomActor = function (_Actor) {
	  _inherits(RandomActor, _Actor);

	  function RandomActor() {
	    _classCallCheck(this, RandomActor);

	    return _possibleConstructorReturn(this, (RandomActor.__proto__ || Object.getPrototypeOf(RandomActor)).apply(this, arguments));
	  }

	  _createClass(RandomActor, [{
	    key: 'timestep',
	    value: function timestep() {
	      _get(RandomActor.prototype.__proto__ || Object.getPrototypeOf(RandomActor.prototype), 'timestep', this).call(this);
	      var actions = this.getActions();
	      var action = actions[Math.floor(Math.random() * actions.length)];
	      this.nextAction = action;
	    }
	  }]);

	  return RandomActor;
	}(_base2.default);

	exports.default = RandomActor;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	var _base = __webpack_require__(5);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Uses A* pathing algorithm to find shortest path to the target
	// Throw in a random move every 10 steps
	var AStarActor = function (_Actor) {
	  _inherits(AStarActor, _Actor);

	  function AStarActor(name, value, board) {
	    _classCallCheck(this, AStarActor);

	    var _this = _possibleConstructorReturn(this, (AStarActor.__proto__ || Object.getPrototypeOf(AStarActor)).call(this, name, value, board));

	    _this.policySteps = 0;

	    // Setup a row + col lookup table that scores all moves on the gameboard
	    _this.squares = {};
	    for (var a = 0; a < _constants2.default.BOARD_LENGTH; a++) {
	      for (var b = 0; b < _constants2.default.BOARD_LENGTH; b++) {
	        _this.squares[keyFromPosition([a, b])] = {};
	      }
	    }
	    return _this;
	  }

	  _createClass(AStarActor, [{
	    key: 'timestep',
	    value: function timestep() {
	      _get(AStarActor.prototype.__proto__ || Object.getPrototypeOf(AStarActor.prototype), 'timestep', this).call(this);
	      this.policySteps += 1;
	      // Do nothing every 2nd-3rd step
	      if (this.policySteps % (3 - Math.floor(Math.random() * 1)) == 0) {
	        return;
	      }

	      // Randomly choose next action every 8-10th step
	      if (this.policySteps % (10 - Math.floor(Math.random() * 2)) == 0) {
	        this.policySteps = 0;
	        this.randomPolicy();
	        return;
	      }

	      // Find shortest path with A* algorithm
	      var iterations = 0;
	      var possible = new Set();
	      var seen = new Set();

	      var current = keyFromPosition(this.pos);
	      var target = keyFromPosition(this.target.pos);
	      this.squares[current].steps = 0;
	      this.squares[current].score = _base2.default.getManhattanDistance(this.pos, this.target.pos);

	      // Find a square with the shortest distance to the target
	      while (current !== target) {
	        seen.add(current);
	        possible.delete(current);

	        // Find the new squares reachable from current square
	        // and then add them to the set of possible squares
	        var currentPos = positionfromKey(current);
	        var actions = this.board.getActions(currentPos[0], currentPos[1]);
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var action = _step.value;

	            var actionPos = _base2.default.getNewPosition(action, currentPos);
	            var actionKey = keyFromPosition(actionPos);
	            if (seen.has(actionKey)) continue;
	            this.squares[actionKey].steps = this.squares[current].steps + 1;
	            this.squares[actionKey].score = this.squares[actionKey].steps + _base2.default.getManhattanDistance(actionPos, this.target.pos);
	            possible.add(actionKey);
	          }

	          // Ensure that there are possible moves remaining
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }

	        if (possible.size < 1) {
	          console.warn('Cannot reach target: ', this.target);
	          this.board.reset();
	          return;
	        }

	        // Select possible square with the lowest score
	        var best = null;
	        var lowestScore = Number.POSITIVE_INFINITY;
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	          for (var _iterator2 = possible[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var key = _step2.value;

	            if (this.squares[key].score < lowestScore) {
	              best = key;
	              lowestScore = this.squares[key].score;
	            }
	          }
	        } catch (err) {
	          _didIteratorError2 = true;
	          _iteratorError2 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }
	          } finally {
	            if (_didIteratorError2) {
	              throw _iteratorError2;
	            }
	          }
	        }

	        current = best;

	        // Break loop if we have done too many iterations
	        iterations++;
	        if (iterations > 5000) {
	          console.error('Too many iterations trying to reach square: ', this.target);
	          this.board.reset();
	          return;
	        }
	      }

	      // Backtrack from our current square to find the next move
	      while (this.squares[current].steps > 1) {
	        var _best = null;
	        var fewestSteps = Number.POSITIVE_INFINITY;
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	          for (var _iterator3 = seen[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	            var _key = _step3.value;

	            var distance = _base2.default.getManhattanDistance(positionfromKey(current), positionfromKey(_key));
	            if (distance === 1 && this.squares[_key].steps < fewestSteps) {
	              _best = _key;
	              fewestSteps = this.squares[_key].steps;
	            }
	          }
	        } catch (err) {
	          _didIteratorError3 = true;
	          _iteratorError3 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	              _iterator3.return();
	            }
	          } finally {
	            if (_didIteratorError3) {
	              throw _iteratorError3;
	            }
	          }
	        }

	        current = _best;
	      }

	      if (current) {
	        this.nextAction = _base2.default.getActionFromPositions(this.pos, positionfromKey(current));
	      }
	    }
	  }, {
	    key: 'randomPolicy',
	    value: function randomPolicy() {
	      var actions = this.getActions();
	      var action = actions[Math.floor(Math.random() * actions.length)];
	      this.nextAction = action;
	    }
	  }]);

	  return AStarActor;
	}(_base2.default);

	exports.default = AStarActor;


	var keyFromPosition = function keyFromPosition(pos) {
	  return pos[0] * 100 + pos[1];
	};
	var positionfromKey = function positionfromKey(key) {
	  return [(key - key % 100) / 100, key % 100];
	};

	var sameRow = function sameRow(sqA, sqB) {
	  return sqA.pos[0] === sqB.pos[0];
	};

	var sameCol = function sameCol(sqA, sqB) {
	  return sqA.pos[1] === sqB.pos[1];
	};

	var samePosition = function samePosition(sqA, sqB) {
	  return sameRow(sqA, sqB) && sameCol(sqA, sqB);
	};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _constants = __webpack_require__(1);

	var _constants2 = _interopRequireDefault(_constants);

	var _base = __webpack_require__(5);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ALPHA = 1;
	var GAMMA = 1;

	var TemporalDifferenceActor = function (_Actor) {
	  _inherits(TemporalDifferenceActor, _Actor);

	  function TemporalDifferenceActor(name, value, board) {
	    _classCallCheck(this, TemporalDifferenceActor);

	    var _this = _possibleConstructorReturn(this, (TemporalDifferenceActor.__proto__ || Object.getPrototypeOf(TemporalDifferenceActor)).call(this, name, value, board));

	    _this.getValue = function (pos) {
	      return _this.values[pos[0]][pos[1]][_this.target.pos[0]][_this.target.pos[1]];
	    };

	    _this.setValue = function (val) {
	      _this.values[_this.pos[0]][_this.pos[1]][_this.target.pos[0]][_this.target.pos[1]] = val;
	    };

	    _this.values = {};
	    var grid = _this.board.grid;
	    // Initialize value of all states to 0
	    for (var a = 0; a < grid.length; a++) {
	      // chicken row
	      for (var b = 0; b < grid.length; b++) {
	        // chicken col
	        for (var c = 0; c < grid.length; c++) {
	          // fox row
	          for (var d = 0; d < grid.length; d++) {
	            // fox col
	            if (grid[a][b] !== _constants2.default.TREE && grid[c][d] !== _constants2.default.TREE) {
	              if (typeof _this.values[a] === 'undefined') {
	                _this.values[a] = {};
	              }
	              if (typeof _this.values[a][b] === 'undefined') {
	                _this.values[a][b] = {};
	              }
	              if (typeof _this.values[a][b][c] === 'undefined') {
	                _this.values[a][b][c] = {};
	              }
	              _this.values[a][b][c][d] = Math.random() / 10;
	            }
	          }
	        }
	      }
	    }
	    return _this;
	  }

	  _createClass(TemporalDifferenceActor, [{
	    key: 'getReward',
	    value: function getReward() {
	      // Reward the chicken for surviving, and punish it for being too close
	      var distance = _base2.default.getManhattanDistance(this.pos, this.target.pos);
	      if (distance < 4) {
	        return -1;
	      } else {
	        return 1;
	      }
	    }
	  }, {
	    key: 'timestep',
	    value: function timestep() {
	      // Perform all actions for this timestep
	      _get(TemporalDifferenceActor.prototype.__proto__ || Object.getPrototypeOf(TemporalDifferenceActor.prototype), 'timestep', this).call(this);

	      // Using the current value function, greedily choose where we're going to go next
	      var bestAction = null;
	      var bestValue = Number.NEGATIVE_INFINITY;
	      var newPosition = this.pos;

	      // Evaluate all possible actions
	      var actions = this.getActions();
	      actions.push(null); // Give the actor the option of not moving
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var action = _step.value;

	          // Find the actor's new position given the action
	          var actionPosition = void 0;
	          if (action) {
	            actionPosition = _base2.default.getNewPosition(action, this.pos);
	          } else {
	            actionPosition = this.pos;
	          }

	          // If this new action is more valuable than our best option, choose that
	          var actionValue = this.getValue(actionPosition);
	          if (actionValue > bestValue) {
	            bestValue = actionValue;
	            bestAction = action;
	            newPosition = actionPosition;
	          }
	        }

	        // Perform the best known action
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      this.nextAction = bestAction;

	      // Using the expected value of our next move, update the value function
	      // with the temporal difference algorithm
	      var reward = this.getReward();
	      var currentValue = this.getValue(this.pos);
	      var expectedValue = this.getValue(newPosition);
	      var targetValue = reward + GAMMA * expectedValue;
	      var error = targetValue - currentValue;
	      var newValue = currentValue + ALPHA * error;
	      this.setValue(newValue);
	    }

	    // Get the value of the state with target position and 'pos'


	    // Set the value of the state with target position and current actor position

	  }]);

	  return TemporalDifferenceActor;
	}(_base2.default);

	exports.default = TemporalDifferenceActor;

/***/ })
/******/ ]);
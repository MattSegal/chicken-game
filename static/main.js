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

	var _view = __webpack_require__(1);

	var _view2 = _interopRequireDefault(_view);

	var _gameboard = __webpack_require__(3);

	var _gameboard2 = _interopRequireDefault(_gameboard);

	var _controls = __webpack_require__(4);

	var _controls2 = _interopRequireDefault(_controls);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Initialize board
	var board = new _gameboard2.default();

	// Draw grid
	_view2.default.drawWhenReady(board.grid);

	// Hook up controls
	new _controls2.default(board);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(2);

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
	          if (grid[i][j] === _constants2.default.FOX) {
	            View.drawSprite(foxImage, i, j);
	          } else if (grid[i][j] === _constants2.default.CHICKEN) {
	            View.drawSprite(chickenImage, i, j);
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
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  // Game constants
	  BOARD_LENGTH: 16, // squares
	  MAX_LENGTH: 900, // px
	  TICK: 100, // ms
	  TRAINING_STEPS: 2 * 1000 * 1000, // 2* 10e6 steps
	  LOGGING: false,
	  TREE_DENSITY: 0.15,
	  MAX_EPISODE_LENGTH: 500, // steps

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(2);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var fillCol = function fillCol() {
	  return Math.random() > _constants2.default.TREE_DENSITY ? _constants2.default.EMPTY : _constants2.default.TREE;
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

	  this.addFox = function (actor) {
	    if (_this.fox) {
	      _this.clearPosition(_this.fox.pos);
	    }
	    _this.fox = actor;
	    _this.setActorPosition(actor);
	    if (_this.fox && _this.chicken) {
	      _this.fox.setTarget(_this.chicken);
	      _this.chicken.setTarget(_this.fox);
	    }
	  };

	  this.addChicken = function (actor) {
	    if (_this.chicken) {
	      _this.clearPosition(_this.chicken.pos);
	    }
	    _this.chicken = actor;
	    _this.setActorPosition(actor);
	    if (_this.fox && _this.chicken) {
	      _this.fox.setTarget(_this.chicken);
	      _this.chicken.setTarget(_this.fox);
	    }
	  };

	  this.moveActors = function () {
	    var _arr = [_this.fox, _this.chicken];

	    for (var _i = 0; _i < _arr.length; _i++) {
	      var actor = _arr[_i];
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
	    setTimeout(function () {
	      _this.reset();
	      _this.runInterval();
	    }, 3 * _constants2.default.TICK);
	  };

	  this.runIters = function (iters) {
	    clearInterval(_this.timerId);
	    for (var i = 0; i < iters; i++) {
	      _this.run(_this.reset);
	    }
	  };

	  this.reset = function () {
	    var _arr2 = [_this.fox, _this.chicken];

	    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
	      var actor = _arr2[_i2];
	      _this.grid[actor.pos[0]][actor.pos[1]] = _constants2.default.EMPTY;
	      actor.reset();
	      _this.setActorPosition(actor);
	    }
	  };

	  this.run = function (reset) {
	    _this.gameIterations++;
	    _this.moveActors();
	    var shoudlReset = _this.gameIterations >= _constants2.default.MAX_EPISODE_LENGTH || distance(_this.fox, _this.chicken) < 2;
	    if (shoudlReset) {
	      // Game over
	      _this.gameIterations = 0;
	      reset();
	      _this.numGames++;
	    }
	  };

	  this.fox = null;
	  this.chicken = null;
	  this.setupGrid();
	  this.timerId = null;
	  this.numGames = 0;
	  this.gameIterations = 0;
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

	var distance = function distance(sqA, sqB) {
	  return Math.abs(sqA.pos[0] - sqB.pos[0]) + Math.abs(sqA.pos[1] - sqB.pos[1]);
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(2);

	var _constants2 = _interopRequireDefault(_constants);

	var _player = __webpack_require__(5);

	var _player2 = _interopRequireDefault(_player);

	var _greedy = __webpack_require__(7);

	var _greedy2 = _interopRequireDefault(_greedy);

	var _random = __webpack_require__(8);

	var _random2 = _interopRequireDefault(_random);

	var _aStar = __webpack_require__(9);

	var _aStar2 = _interopRequireDefault(_aStar);

	var _temporalDifference = __webpack_require__(10);

	var _temporalDifference2 = _interopRequireDefault(_temporalDifference);

	var _monteCarlo = __webpack_require__(12);

	var _monteCarlo2 = _interopRequireDefault(_monteCarlo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var chickenOptions = {
	  'temporal difference': function temporalDifference(board) {
	    return new _temporalDifference2.default('chicken', _constants2.default.CHICKEN, board);
	  },
	  'monte carlo': function monteCarlo(board) {
	    return new _monteCarlo2.default('chicken', _constants2.default.CHICKEN, board);
	  },
	  random: function random(board) {
	    return new _random2.default('chicken', _constants2.default.CHICKEN, board);
	  },
	  'greedy flight': function greedyFlight(board) {
	    return new _greedy2.default('chicken', _constants2.default.CHICKEN, board).flee();
	  },
	  player: function player(board) {
	    return new _player2.default('chicken', _constants2.default.CHICKEN, board);
	  }
	};

	var foxOptions = {
	  'greedy pursuit': function greedyPursuit(board) {
	    return new _greedy2.default('fox', _constants2.default.FOX, board).follow();
	  },
	  'a* search': function aSearch(board) {
	    return new _aStar2.default('fox', _constants2.default.FOX, board);
	  },
	  'monte carlo': function monteCarlo(board) {
	    return new _monteCarlo2.default('fox', _constants2.default.FOX, board).follow();
	  },
	  'temporal difference': function temporalDifference(board) {
	    return new _temporalDifference2.default('fox', _constants2.default.FOX, board).follow();
	  },
	  random: function random(board) {
	    return new _random2.default('fox', _constants2.default.FOX, board);
	  },
	  player: function player(board) {
	    return new _player2.default('fox', _constants2.default.FOX, board);
	  }
	};

	var Controller = function () {
	  function Controller(board) {
	    var _this = this;

	    _classCallCheck(this, Controller);

	    this.onNewGame = function (e) {
	      return _this.board.reset();
	    };

	    this.onSelectFox = function (e) {
	      e.target.blur();
	      _this.board.addFox(foxOptions[e.target.value](_this.board));
	    };

	    this.onSelectChicken = function (e) {
	      var key = e.target.value;
	      e.target.blur();
	      _this.board.addChicken(chickenOptions[key](_this.board));
	    };

	    this.onTrain = function (e) {
	      _this.board.runIters(_constants2.default.TRAINING_STEPS);
	      _this.board.reset();
	      _this.board.runInterval();
	    };

	    this.board = board;
	    this.actors = {};

	    board.addFox(foxOptions[Object.keys(foxOptions)[0]](board));
	    board.addChicken(chickenOptions[Object.keys(chickenOptions)[0]](board));

	    this.node = document.getElementById('controls');
	    this.buildSelect('chicken algorithm', chickenOptions, this.onSelectChicken);
	    this.buildSelect('fox algorithm', foxOptions, this.onSelectFox);
	    this.buildButton('new game', this.onNewGame);
	    this.trainBtn = this.buildButton('train', this.onTrain);
	    board.runInterval();
	  }

	  _createClass(Controller, [{
	    key: 'buildSelect',
	    value: function buildSelect(text, options, onChange) {
	      var select = document.createElement('select');
	      for (var key in options) {
	        var option = document.createElement('option');
	        option.value = key;
	        option.append(key);
	        select.appendChild(option);
	      }
	      select.onchange = onChange;
	      var label = document.createElement('label');
	      label.append(text);
	      var control = document.createElement('div');
	      control.classList.add('control');
	      control.appendChild(label);
	      control.appendChild(select);
	      this.node.appendChild(control);
	      return control;
	    }
	  }, {
	    key: 'buildButton',
	    value: function buildButton(text, onClick) {
	      var button = document.createElement('div');
	      button.classList.add('button');
	      button.onclick = onClick;
	      button.append(text);
	      this.node.appendChild(button);
	      return button;
	    }
	  }]);

	  return Controller;
	}();

	exports.default = Controller;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(6);

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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(2);

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

	    this.setTarget = function (target) {
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
	      this.board.setActorPosition(this);
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _OPPOSITE;

	var _constants = __webpack_require__(2);

	var _constants2 = _interopRequireDefault(_constants);

	var _base = __webpack_require__(6);

	var _base2 = _interopRequireDefault(_base);

	var _utils = __webpack_require__(11);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var OPPOSITE = (_OPPOSITE = {}, _defineProperty(_OPPOSITE, _constants2.default.ACTIONS.NORTH, _constants2.default.ACTIONS.SOUTH), _defineProperty(_OPPOSITE, _constants2.default.ACTIONS.SOUTH, _constants2.default.ACTIONS.NORTH), _defineProperty(_OPPOSITE, _constants2.default.ACTIONS.EAST, _constants2.default.ACTIONS.WEST), _defineProperty(_OPPOSITE, _constants2.default.ACTIONS.WEST, _constants2.default.ACTIONS.EAST), _OPPOSITE);

	var GreedyActor = function (_Actor) {
	  _inherits(GreedyActor, _Actor);

	  function GreedyActor(name, value, board) {
	    _classCallCheck(this, GreedyActor);

	    var _this = _possibleConstructorReturn(this, (GreedyActor.__proto__ || Object.getPrototypeOf(GreedyActor)).call(this, name, value, board));

	    _this.isFollowing = true;
	    return _this;
	  }

	  _createClass(GreedyActor, [{
	    key: 'flee',
	    value: function flee() {
	      this.isFollowing = false;
	      return this;
	    }
	  }, {
	    key: 'follow',
	    value: function follow() {
	      this.isFollowing = true;
	      return this;
	    }
	  }, {
	    key: 'timestep',
	    value: function timestep() {
	      _get(GreedyActor.prototype.__proto__ || Object.getPrototypeOf(GreedyActor.prototype), 'timestep', this).call(this);
	      var row = this.pos[0];
	      var col = this.pos[1];
	      var targetRow = this.target.pos[0];
	      var targetCol = this.target.pos[1];

	      var actions = this.board.getActions(row, col);
	      var seen = new Set();

	      var chosenAction = null;
	      var iter = 0;
	      while (!chosenAction) {
	        iter++;
	        if (iter > 100) {
	          console.warn('GreedyActor is too tired to continue.');
	          this.board.reset();
	          return;
	        }
	        var action = (0, _utils.randomChoice)(actions);
	        var chooseGreedily = action === _constants2.default.ACTIONS.NORTH && row > targetRow || action === _constants2.default.ACTIONS.SOUTH && row < targetRow || action === _constants2.default.ACTIONS.EAST && col < targetCol || action === _constants2.default.ACTIONS.WEST && col > targetCol;
	        if (chooseGreedily) {
	          if (this.isFollowing) {
	            chosenAction = action;
	          } else if (actions.includes(OPPOSITE[action])) {
	            chosenAction = OPPOSITE[action];
	          }
	        }
	        seen.add(action);
	        if (seen.size >= actions.length) {
	          // Choose a random action if there are no greedy options
	          chosenAction = action;
	        }
	      }
	      this.nextAction = chosenAction;
	    }
	  }]);

	  return GreedyActor;
	}(_base2.default);

	exports.default = GreedyActor;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _base = __webpack_require__(6);

	var _base2 = _interopRequireDefault(_base);

	var _utils = __webpack_require__(11);

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
	      this.nextAction = (0, _utils.randomChoice)(this.getActions());
	    }
	  }]);

	  return RandomActor;
	}(_base2.default);

	exports.default = RandomActor;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _constants = __webpack_require__(2);

	var _constants2 = _interopRequireDefault(_constants);

	var _base = __webpack_require__(6);

	var _base2 = _interopRequireDefault(_base);

	var _utils = __webpack_require__(11);

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

	    // Setup a row + col lookup table that scores all moves on the gameboard
	    var _this = _possibleConstructorReturn(this, (AStarActor.__proto__ || Object.getPrototypeOf(AStarActor)).call(this, name, value, board));

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
	          for (var _iterator = (0, _utils.shuffle)(actions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
	          _constants2.default.LOGGING && console.warn('Cannot reach target: ', this.target);
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
	          _constants2.default.LOGGING && console.error('Too many iterations trying to reach square: ', this.target);
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _constants = __webpack_require__(2);

	var _constants2 = _interopRequireDefault(_constants);

	var _base = __webpack_require__(6);

	var _base2 = _interopRequireDefault(_base);

	var _stateSpace = __webpack_require__(13);

	var _stateSpace2 = _interopRequireDefault(_stateSpace);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ALPHA = 0.9;
	var GAMMA = 0.9;

	var TemporalDifferenceActor = function (_Actor) {
	  _inherits(TemporalDifferenceActor, _Actor);

	  function TemporalDifferenceActor(name, value, board) {
	    _classCallCheck(this, TemporalDifferenceActor);

	    var _this = _possibleConstructorReturn(this, (TemporalDifferenceActor.__proto__ || Object.getPrototypeOf(TemporalDifferenceActor)).call(this, name, value, board));

	    _this.getValue = function (pos) {
	      return _this.states.getStateFromPositions(pos, _this.target.pos).value;
	    };

	    _this.setValue = function (val) {
	      var state = _this.states.getStateFromPositions(_this.pos, _this.target.pos);
	      state.value = val;
	    };

	    _this.isFleeing = true;
	    _this.states = new _stateSpace2.default(_this.board.grid, function () {
	      return { value: 0 };
	    });
	    return _this;
	  }

	  _createClass(TemporalDifferenceActor, [{
	    key: 'flee',
	    value: function flee() {
	      this.isFleeing = true;
	      return this;
	    }
	  }, {
	    key: 'follow',
	    value: function follow() {
	      this.isFleeing = false;
	      return this;
	    }
	  }, {
	    key: 'getReward',
	    value: function getReward() {
	      var distance = _base2.default.getManhattanDistance(this.pos, this.target.pos);
	      if (this.isFleeing) {
	        // Encourage a fleer to keep away
	        return distance < 5 ? -1 : 1;
	      } else {
	        // Encourage a follower to close the distance
	        return -1 * distance;
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

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";

	// Thanks StackOverflow!
	var shuffle = function shuffle(a) {
	    var j, x, i;
	    for (i = a.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = a[i];
	        a[i] = a[j];
	        a[j] = x;
	    }
	    return a;
	};

	var randomChoice = function randomChoice(a) {
	    return a[Math.floor(Math.random() * a.length)];
	};

	module.exports = { shuffle: shuffle, randomChoice: randomChoice };

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _constants = __webpack_require__(2);

	var _constants2 = _interopRequireDefault(_constants);

	var _base = __webpack_require__(6);

	var _base2 = _interopRequireDefault(_base);

	var _stateSpace = __webpack_require__(13);

	var _stateSpace2 = _interopRequireDefault(_stateSpace);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ALPHA = 0.9;

	var MonteCarloActor = function (_Actor) {
	  _inherits(MonteCarloActor, _Actor);

	  function MonteCarloActor(name, value, board) {
	    _classCallCheck(this, MonteCarloActor);

	    var _this = _possibleConstructorReturn(this, (MonteCarloActor.__proto__ || Object.getPrototypeOf(MonteCarloActor)).call(this, name, value, board));

	    _this.isFleeing = true;
	    _this.episodeReward = 0;
	    _this.states = new _stateSpace2.default(_this.board.grid, function () {
	      return {
	        value: 0,
	        visits: 0
	      };
	    });
	    _this.seen = new Set();
	    return _this;
	  }

	  _createClass(MonteCarloActor, [{
	    key: 'flee',
	    value: function flee() {
	      this.isFleeing = true;
	      return this;
	    }
	  }, {
	    key: 'follow',
	    value: function follow() {
	      this.isFleeing = false;
	      return this;
	    }
	  }, {
	    key: 'getReward',
	    value: function getReward() {
	      var distance = _base2.default.getManhattanDistance(this.pos, this.target.pos);
	      if (this.isFleeing) {
	        // Encourage a fleer to keep away
	        return distance < 5 ? -1 : 1;
	      } else {
	        // Encourage a follower to close the distance
	        return -1 * distance;
	      }
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      _get(MonteCarloActor.prototype.__proto__ || Object.getPrototypeOf(MonteCarloActor.prototype), 'reset', this).call(this);
	      if (!this.seen) return;
	      // Update our value function with information from this episode
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.seen[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var seenKey = _step.value;

	          var state = this.states.getState(seenKey);
	          var error = this.episodeReward - state.value;
	          state.value += ALPHA / state.visits * error;
	        }
	        // Reset our reward and seen states
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

	      this.episodeReward = 0;
	      this.seen = new Set();
	    }
	  }, {
	    key: 'timestep',
	    value: function timestep() {
	      // Perform all actions for this timestep
	      _get(MonteCarloActor.prototype.__proto__ || Object.getPrototypeOf(MonteCarloActor.prototype), 'timestep', this).call(this);

	      // Record the reward we got for this timestep
	      this.episodeReward += this.getReward();
	      // Record our visit to this state
	      var lookupKey = this.states.getKeyFromPositions(this.pos, this.target.pos);
	      this.seen.add(lookupKey);
	      var currentState = this.states.getState(lookupKey);
	      currentState.visits += 1;

	      // Using the current value function, greedily choose where we're going to go next
	      var bestAction = null;
	      var bestValue = Number.NEGATIVE_INFINITY;
	      var newPosition = this.pos;

	      // Evaluate all possible actions
	      var actions = this.getActions();
	      actions.push(null); // Give the actor the option of not moving
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = actions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var action = _step2.value;

	          // Find the actor's new position given the action
	          var actionPosition = void 0;
	          if (action) {
	            actionPosition = _base2.default.getNewPosition(action, this.pos);
	          } else {
	            actionPosition = this.pos;
	          }

	          // If this new action is more valuable than our best option, choose that
	          var nextState = this.states.getStateFromPositions(actionPosition, this.target.pos);
	          if (nextState.value > bestValue) {
	            bestValue = nextState.value;
	            bestAction = action;
	            newPosition = actionPosition;
	          }
	        }

	        // Perform the best known action
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

	      this.nextAction = bestAction;
	    }
	  }]);

	  return MonteCarloActor;
	}(_base2.default);

	exports.default = MonteCarloActor;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Build a state space made of 4 variables
	// - chicken row (a)
	// - chicken column (b)
	// - fox row (c)
	// - fox column (d)
	// initialize each state as an object
	// Store these values in nested hash tables, indexed by [a][b][c][d]


	var _constants = __webpack_require__(2);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var StateSpace = function () {
	  function StateSpace(grid, initState) {
	    var _this = this;

	    _classCallCheck(this, StateSpace);

	    this.getKeyFromPositions = function (chickenPos, foxPos) {
	      return _this.getKey(chickenPos[0], chickenPos[1], foxPos[0], foxPos[1]);
	    };

	    this.states = {};
	    for (var a = 0; a < grid.length; a++) {
	      // chicken row
	      for (var b = 0; b < grid.length; b++) {
	        // chicken col
	        for (var c = 0; c < grid.length; c++) {
	          // fox row
	          for (var d = 0; d < grid.length; d++) {
	            // fox col
	            if (grid[a][b] !== _constants2.default.TREE && grid[c][d] !== _constants2.default.TREE) {
	              this.states[this.getKey(a, b, c, d)] = initState();
	            }
	          }
	        }
	      }
	    }
	  }

	  _createClass(StateSpace, [{
	    key: 'getState',
	    value: function getState(key) {
	      // Return mutable state object
	      return this.states[key];
	    }
	  }, {
	    key: 'getStateFromPositions',
	    value: function getStateFromPositions(chickenPos, foxPos) {
	      return this.getState(this.getKeyFromPositions(chickenPos, foxPos));
	    }
	  }, {
	    key: 'getKey',
	    value: function getKey(a, b, c, d) {
	      // Represent a state as an integer 00000000 to 99999999,
	      // assume max 99 rows / cols and 2 positions
	      return 1000000 * a + 10000 * b + 100 * c + d;
	    }
	  }]);

	  return StateSpace;
	}();

	exports.default = StateSpace;

/***/ })
/******/ ]);
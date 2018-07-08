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

	var _gameboard = __webpack_require__(4);

	var _gameboard2 = _interopRequireDefault(_gameboard);

	var _player = __webpack_require__(5);

	var _player2 = _interopRequireDefault(_player);

	var _random = __webpack_require__(6);

	var _random2 = _interopRequireDefault(_random);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import AStarActor from './actors/a-star'

	// Initialize board
	var board = new _gameboard2.default();

	// Draw grid
	_view2.default.drawWhenReady(board.grid);

	// Create actors
	var fox = new _random2.default(_constants2.default.FOX, board);
	var chicken = new _random2.default(_constants2.default.CHICKEN, board);

	// Run the game
	board.run();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  // Game constants
	  BOARD_LENGTH: 20, // squares
	  MAX_LENGTH: 900, // px
	  TICK: 300, // ms

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
/* 3 */,
/* 4 */
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

	  this.reset = function () {
	    _this.grid = Array(_constants2.default.BOARD_LENGTH).fill(0).map(fillRow);
	    // TODO: Add all actors to the board
	  };

	  this.addActor = function (actor) {
	    _this.actors.push(actor);
	    _this.setActorPosition(actor);
	  };

	  this.moveActors = function () {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = _this.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var actor = _step.value;

	        actor.runPolicy();
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

	  this.run = function () {
	    _this.moveActors();
	    // TODO: Add win condition
	    setTimeout(_this.run, _constants2.default.TICK);
	  };

	  this.reset();
	  this.actors = [];
	};

	exports.default = GameBoard;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(7);

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

	  function PlayerActor(value, board) {
	    _classCallCheck(this, PlayerActor);

	    var _this = _possibleConstructorReturn(this, (PlayerActor.__proto__ || Object.getPrototypeOf(PlayerActor)).call(this, value, board));

	    _this.runPolicy = function () {
	      // Do nothing
	    };

	    document.addEventListener('keydown', function (e) {
	      var nextAction = MOVES[e.key] || null;
	      var actions = _this.getActions();
	      if (actions.includes(nextAction)) {
	        _this.nextAction = nextAction;
	      }
	    });
	    return _this;
	  }

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

	var _base = __webpack_require__(7);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Totally random actor
	var RandomActor = function (_Actor) {
	  _inherits(RandomActor, _Actor);

	  function RandomActor() {
	    var _ref;

	    var _temp, _this, _ret;

	    _classCallCheck(this, RandomActor);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RandomActor.__proto__ || Object.getPrototypeOf(RandomActor)).call.apply(_ref, [this].concat(args))), _this), _this.runPolicy = function () {
	      var actions = _this.getActions();
	      var action = actions[Math.floor(Math.random() * actions.length)];
	      _this.nextAction = action;
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }

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

	var Actor = function Actor(value, board) {
	  var _this = this;

	  _classCallCheck(this, Actor);

	  this.runPolicy = function () {
	    // To be implemented by child class
	  };

	  this.reset = function () {
	    _this.pos = randomPosition();
	    _this.board.addActor(_this);
	  };

	  this.getActions = function () {
	    return _this.board.getActions(_this.pos[0], _this.pos[1]);
	  };

	  this.value = value;
	  this.nextAction = null;
	  this.board = board;
	  this.reset();
	};

	exports.default = Actor;

/***/ })
/******/ ]);
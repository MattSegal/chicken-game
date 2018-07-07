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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Initialize grid
	var fillCol = function fillCol() {
	  return Math.random() > 0.2 ? _constants2.default.EMPTY : _constants2.default.TREE;
	};
	var fillRow = function fillRow() {
	  return Array(_constants2.default.BOARD_LENGTH).fill(0).map(fillCol);
	};
	var grid = Array(_constants2.default.BOARD_LENGTH).fill(0).map(fillRow);

	// Draw grid
	_view2.default.onImagesLoaded().then(function () {
	  return _view2.default.drawGrid(grid);
	});

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
	  EMPTY: 'EMPTY',
	  CHICKEN: 'CHICKEN',
	  FOX: 'FOX',
	  TREE: 'TREE'
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

	// sprites are all 256 x 256
	var SRC_LENGTH = 256; // px
	var PADDING = 5; // px

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
	canvas.width = _constants2.default.MAX_LENGTH;
	canvas.height = _constants2.default.MAX_LENGTH;
	var ctx = canvas.getContext('2d');

	var View = function () {
	  function View() {
	    _classCallCheck(this, View);
	  }

	  _createClass(View, null, [{
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
	    key: 'drawGrid',
	    value: function drawGrid(grid) {
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
	      var x = col * squareLength + PADDING;
	      var y = row * squareLength + PADDING;
	      var length = squareLength - 2 * PADDING;
	      ctx.drawImage(img, 0, 0, SRC_LENGTH, SRC_LENGTH, x, y, length, length);
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

/***/ })
/******/ ]);
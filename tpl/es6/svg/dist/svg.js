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
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __svg__ = { filename: "../../images/svg/sprite.1477558027574.svg" }

	__webpack_require__(1)(__svg__)


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Load svg via ajax
	 * @param  {string} url path to svg sprite
	 * @generator: webpack-svgstore-plugin
	 * @see: https://www.npmjs.com/package/webpack-svgstore-plugin
	 * @return {[type]}     [description]
	 */
	var svgXHR = function(options) {
	  var url = false;
	  var baseUrl = undefined;

	  options && options.filename
	    ? url = options.filename
	    : null;

	  if (!url) return false;
	  var _ajax = new XMLHttpRequest();
	  var _fullPath;

	  if (typeof XDomainRequest !== 'undefined') {
	    _ajax = new XDomainRequest();
	  }

	  if (typeof baseUrl === 'undefined') {
	    if (typeof window.baseUrl !== 'undefined') {
	      baseUrl = window.baseUrl;
	    } else {
	      baseUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
	    }
	  }

	  _fullPath = (baseUrl + '/' + url).replace(/([^:]\/)\/+/g, '$1');
	  _ajax.open('GET', _fullPath, true);
	  _ajax.onprogress = function() {};
	  _ajax.onload = function() {
	    if(!_ajax.responseText || _ajax.responseText.substr(0, 4) !== "<svg") {
	      throw Error("Invalid SVG Response");
	    }
	    var div = document.createElement('div');
	    div.innerHTML = _ajax.responseText;
	    document.body.insertBefore(div, document.body.childNodes[0]);
	  };
	  _ajax.send();
	};

	module.exports = svgXHR;


/***/ }
/******/ ]);
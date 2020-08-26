/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("// import testImg from \"./test-img.jpeg\"\n// import style from \"./index.modules.suss\";\n// // import \"./index.scss\"\n// import \"./font/iconfont.css\"\n// console.log(style, 'style5')\n// const img = new Image();\n// img.src = testImg;\n// img.classList.add(style.root.image)\n// let root = document.getElementById('root')\n// root.appendChild(img)\n// const div = document.createElement(\"div\")\n// div.id = 'icon'\n// div.className = \"iconshuaxinzhongjieban iconfont\"\n// root.appendChild(div)\n// 使用sourceMap\n// 故意写错 devTool:\"none\" 没有映射关系\n// // console.log(\"hello world1111\")\n// import \"./index.css\"\n// const root = document.getElementById(\"root\")\n// const btn = document.createElement(\"button\")\n// btn.innerText = \"点击我\"\n// root.appendChild(btn)\n// console.log(\"add\")\n// btn.addEventListener('click', () => {\n//     const div = document.createElement('div')\n//     div.innerText = '创建的div'\n//     div.className = 'div'\n//     root.appendChild(div)\n// })\n// import count from \"./HRM/count\"\n// import number from \"./HRM/number\"\n// count()\n// number()\n// if (module.hot) {\n//     module.hot.accept(\"./HRM/number\", () => {\n//         const numberDom = document.getElementById(\"number\")\n//         document.body.removeChild(numberDom)\n//         number()\n//     })\n// }\n// import \"@babel/polyfill\";\n// Babel处理ES6语法\n// const arr = [\n//     new Promise(() => {}),\n//     new Promise(() => {})\n// ]\n// arr.map(i => {\n//     return i\n// })\n// import \"./index.css\"\n// import {\n//     sum\n// } from \"./treeShaking/index.js\"\nfunction importLoadsh() {\n  return __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.t.bind(null, /*! lodash */ \"./node_modules/_lodash@4.17.20@lodash/lodash.js\", 7)).then(function (_ref) {\n    var _ = _ref.default;\n    var ele = document.createElement(\"div\");\n    ele.innerHTML = 'wang.haoyu';\n    return ele;\n  });\n}\n\nimportLoadsh().then(function (ele) {\n  document.body.appendChild(ele);\n}); // const loadshJoin = _.join([4, 5, 6], \"**\")\n// console.log(loadshJoin)\n// console.log(sum(3, 5))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbWFpbi5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9tYWluLmpzPzU2ZDciXSwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHRlc3RJbWcgZnJvbSBcIi4vdGVzdC1pbWcuanBlZ1wiXG4vLyBpbXBvcnQgc3R5bGUgZnJvbSBcIi4vaW5kZXgubW9kdWxlcy5zdXNzXCI7XG4vLyAvLyBpbXBvcnQgXCIuL2luZGV4LnNjc3NcIlxuLy8gaW1wb3J0IFwiLi9mb250L2ljb25mb250LmNzc1wiXG5cblxuLy8gY29uc29sZS5sb2coc3R5bGUsICdzdHlsZTUnKVxuLy8gY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4vLyBpbWcuc3JjID0gdGVzdEltZztcbi8vIGltZy5jbGFzc0xpc3QuYWRkKHN0eWxlLnJvb3QuaW1hZ2UpXG4vLyBsZXQgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jylcbi8vIHJvb3QuYXBwZW5kQ2hpbGQoaW1nKVxuXG4vLyBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4vLyBkaXYuaWQgPSAnaWNvbidcbi8vIGRpdi5jbGFzc05hbWUgPSBcImljb25zaHVheGluemhvbmdqaWViYW4gaWNvbmZvbnRcIlxuLy8gcm9vdC5hcHBlbmRDaGlsZChkaXYpXG5cbi8vIOS9v+eUqHNvdXJjZU1hcFxuLy8g5pWF5oSP5YaZ6ZSZIGRldlRvb2w6XCJub25lXCIg5rKh5pyJ5pig5bCE5YWz57O7XG4vLyAvLyBjb25zb2xlLmxvZyhcImhlbGxvIHdvcmxkMTExMVwiKVxuLy8gaW1wb3J0IFwiLi9pbmRleC5jc3NcIlxuLy8gY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKVxuLy8gY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxuLy8gYnRuLmlubmVyVGV4dCA9IFwi54K55Ye75oiRXCJcbi8vIHJvb3QuYXBwZW5kQ2hpbGQoYnRuKVxuLy8gY29uc29sZS5sb2coXCJhZGRcIilcbi8vIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbi8vICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuLy8gICAgIGRpdi5pbm5lclRleHQgPSAn5Yib5bu655qEZGl2J1xuLy8gICAgIGRpdi5jbGFzc05hbWUgPSAnZGl2J1xuLy8gICAgIHJvb3QuYXBwZW5kQ2hpbGQoZGl2KVxuLy8gfSlcbi8vIGltcG9ydCBjb3VudCBmcm9tIFwiLi9IUk0vY291bnRcIlxuLy8gaW1wb3J0IG51bWJlciBmcm9tIFwiLi9IUk0vbnVtYmVyXCJcblxuXG4vLyBjb3VudCgpXG4vLyBudW1iZXIoKVxuXG4vLyBpZiAobW9kdWxlLmhvdCkge1xuLy8gICAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiLi9IUk0vbnVtYmVyXCIsICgpID0+IHtcbi8vICAgICAgICAgY29uc3QgbnVtYmVyRG9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJudW1iZXJcIilcbi8vICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChudW1iZXJEb20pXG4vLyAgICAgICAgIG51bWJlcigpXG4vLyAgICAgfSlcbi8vIH1cblxuLy8gaW1wb3J0IFwiQGJhYmVsL3BvbHlmaWxsXCI7XG4vLyBCYWJlbOWkhOeQhkVTNuivreazlVxuLy8gY29uc3QgYXJyID0gW1xuLy8gICAgIG5ldyBQcm9taXNlKCgpID0+IHt9KSxcbi8vICAgICBuZXcgUHJvbWlzZSgoKSA9PiB7fSlcbi8vIF1cbi8vIGFyci5tYXAoaSA9PiB7XG4vLyAgICAgcmV0dXJuIGlcbi8vIH0pXG4vLyBpbXBvcnQgXCIuL2luZGV4LmNzc1wiXG4vLyBpbXBvcnQge1xuLy8gICAgIHN1bVxuLy8gfSBmcm9tIFwiLi90cmVlU2hha2luZy9pbmRleC5qc1wiXG5cblxuZnVuY3Rpb24gaW1wb3J0TG9hZHNoKCkge1xuICAgIHJldHVybiBpbXBvcnQgKFwibG9kYXNoXCIpLnRoZW4oKHtcbiAgICAgICAgZGVmYXVsdDogX1xuICAgIH0pID0+IHtcbiAgICAgICAgbGV0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgZWxlLmlubmVySFRNTCA9ICd3YW5nLmhhb3l1J1xuICAgICAgICByZXR1cm4gZWxlXG4gICAgfSlcbn1cbmltcG9ydExvYWRzaCgpLnRoZW4oKGVsZSkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlKVxufSlcblxuLy8gY29uc3QgbG9hZHNoSm9pbiA9IF8uam9pbihbNCwgNSwgNl0sIFwiKipcIilcbi8vIGNvbnNvbGUubG9nKGxvYWRzaEpvaW4pXG4vLyBjb25zb2xlLmxvZyhzdW0oMywgNSkpIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBR0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main.js\n");

/***/ })

/******/ });
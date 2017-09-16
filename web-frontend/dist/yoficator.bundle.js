/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toast;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(1);


const SNACKBAR_HTML = `
    <div 
        id="yoficator-snackbar" 
        style="
            min-width: 250px; 
            transform: translateX(-50%); 
            background-color: #333; 
            color: #fff; 
            text-align: center; 
            border-radius: 2px; 
            padding: 16px; 
            position: fixed; 
            z-index: 1; 
            left: 50%; 
            bottom: 30px;"
    >Спасибо, что воспользовались ёфикатором!</div>`;
$('body').append(SNACKBAR_HTML);

// todo убрать `error`
function toast(status, error = null) {
    console.log(status);
    let snackbar = $('#yoficator-snackbar');
    Object(__WEBPACK_IMPORTED_MODULE_0__base__["a" /* assert */])(snackbar.length === 1);
    if (error !== null) {
        status += '\nПожалуйста, попробуйте обновить страницу. \nЕсли это не поможет, свяжитесь с [[Участник:Дима74|автором скрипта]].';
    }

    status = status.replace(/\n/g, '<br />');
    // [[ссылка|имя]] -> <a href="/wiki/ссылка">имя</a>
    status = status.replace(/\[\[([^|]*)\|([^\]]*)]]/g, '<a href="/wiki/$1" style="color: #0ff;">$2</a>');
    snackbar.html(status);
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = assert;
/* harmony export (immutable) */ __webpack_exports__["b"] = fetchJson;
/* harmony export (immutable) */ __webpack_exports__["c"] = removeArgumentsFromUrl;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__toast__ = __webpack_require__(0);


function assert(expression, message = 'Непредвиденная ошибка') {
    if (!expression) {
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])(message);
        throw message;
    }
}

async function fetchJson(url, info) {
    info = Object.assign({errorMessage: 'todo'}, info);

    try {
        return (await fetch(url)).json();
    } catch (e) {
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])(info.errorMessage);
        throw e;
    }
}

function removeArgumentsFromUrl() {
    window.history.pushState('', '', window.location.href.replace('?yofication', ''));
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "main", function() { return main; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery_scrollto__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery_scrollto___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery_scrollto__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wikipedia_api__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__toast__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__backend__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__yofication__ = __webpack_require__(8);






const settings = {
    addPortletLinkAction: typeof Eficator_AddPortletLinkAction === 'undefined' ? true : Eficator_AddPortleteLinkAction,
    editSummary: typeof Eficator_EditSummary === 'undefined' ? 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]' : Eficator_EditSummary,
    minReplaceFrequency: typeof Eficator_MinReplaceFrequency === 'undefined' ? 60 : Eficator_MinReplaceFrequency
};

class Main {
    constructor() {
        this.wikipediaApi = new __WEBPACK_IMPORTED_MODULE_1__wikipedia_api__["a" /* default */]();
        this.backend = new __WEBPACK_IMPORTED_MODULE_3__backend__["a" /* default */]();
    }

    start() {
        this.performContinuousYofication();
        return;

        if (this.wikipediaApi.getPageNameFull() === 'Служебная:Ёфикация') {
            this.performContinuousYofication();
        } else if (window.location.search.includes('yofication')) {
            let continuousYofication = window.location.search.includes('continuous_yofication');
            new __WEBPACK_IMPORTED_MODULE_4__yofication__["a" /* default */](continuousYofication).perform();
        } else if (settings.addPortletLinkAction && this.wikipediaApi.isMainNamespace()) {
            mw.util.addPortletLink('p-cactions', '/wiki/' + this.wikipediaApi.getPageNameFull() + '?yofication', 'Ёфицировать', 'ca-eficator', ' Ёфицировать страницу');
        }
    }

    async performContinuousYofication() {
        Object(__WEBPACK_IMPORTED_MODULE_2__toast__["a" /* default */])('Переходим к следующей странице: \nЗагружаем название статьи для ёфикации...');
        let pageName = await this.backend.getRandomPageName();
        console.log(pageName);
        // window.location.href = 'https://ru.wikipedia.org/wiki/' + pageName + '?continuous_yofication';
    }
}

let main = new Main();
main.start();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery.scrollTo
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @projectDescription Lightweight, cross-browser and highly customizable animated scrolling with jQuery
 * @author Ariel Flesler
 * @version 2.1.2
 */
;(function(factory) {
	'use strict';
	if (true) {
		// AMD
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module !== 'undefined' && module.exports) {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Global
		factory(jQuery);
	}
})(function($) {
	'use strict';

	var $scrollTo = $.scrollTo = function(target, duration, settings) {
		return $(window).scrollTo(target, duration, settings);
	};

	$scrollTo.defaults = {
		axis:'xy',
		duration: 0,
		limit:true
	};

	function isWin(elem) {
		return !elem.nodeName ||
			$.inArray(elem.nodeName.toLowerCase(), ['iframe','#document','html','body']) !== -1;
	}		

	$.fn.scrollTo = function(target, duration, settings) {
		if (typeof duration === 'object') {
			settings = duration;
			duration = 0;
		}
		if (typeof settings === 'function') {
			settings = { onAfter:settings };
		}
		if (target === 'max') {
			target = 9e9;
		}

		settings = $.extend({}, $scrollTo.defaults, settings);
		// Speed is still recognized for backwards compatibility
		duration = duration || settings.duration;
		// Make sure the settings are given right
		var queue = settings.queue && settings.axis.length > 1;
		if (queue) {
			// Let's keep the overall duration
			duration /= 2;
		}
		settings.offset = both(settings.offset);
		settings.over = both(settings.over);

		return this.each(function() {
			// Null target yields nothing, just like jQuery does
			if (target === null) return;

			var win = isWin(this),
				elem = win ? this.contentWindow || window : this,
				$elem = $(elem),
				targ = target, 
				attr = {},
				toff;

			switch (typeof targ) {
				// A number will pass the regex
				case 'number':
				case 'string':
					if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
						targ = both(targ);
						// We are done
						break;
					}
					// Relative/Absolute selector
					targ = win ? $(targ) : $(targ, elem);
					/* falls through */
				case 'object':
					if (targ.length === 0) return;
					// DOMElement / jQuery
					if (targ.is || targ.style) {
						// Get the real position of the target
						toff = (targ = $(targ)).offset();
					}
			}

			var offset = $.isFunction(settings.offset) && settings.offset(elem, targ) || settings.offset;

			$.each(settings.axis.split(''), function(i, axis) {
				var Pos	= axis === 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					prev = $elem[key](),
					max = $scrollTo.max(elem, axis);

				if (toff) {// jQuery / DOMElement
					attr[key] = toff[pos] + (win ? 0 : prev - $elem.offset()[pos]);

					// If it's a dom element, reduce the margin
					if (settings.margin) {
						attr[key] -= parseInt(targ.css('margin'+Pos), 10) || 0;
						attr[key] -= parseInt(targ.css('border'+Pos+'Width'), 10) || 0;
					}

					attr[key] += offset[pos] || 0;

					if (settings.over[pos]) {
						// Scroll to a fraction of its width/height
						attr[key] += targ[axis === 'x'?'width':'height']() * settings.over[pos];
					}
				} else {
					var val = targ[pos];
					// Handle percentage values
					attr[key] = val.slice && val.slice(-1) === '%' ?
						parseFloat(val) / 100 * max
						: val;
				}

				// Number or 'number'
				if (settings.limit && /^\d+$/.test(attr[key])) {
					// Check the limits
					attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
				}

				// Don't waste time animating, if there's no need.
				if (!i && settings.axis.length > 1) {
					if (prev === attr[key]) {
						// No animation needed
						attr = {};
					} else if (queue) {
						// Intermediate animation
						animate(settings.onAfterFirst);
						// Don't animate this axis again in the next iteration.
						attr = {};
					}
				}
			});

			animate(settings.onAfter);

			function animate(callback) {
				var opts = $.extend({}, settings, {
					// The queue setting conflicts with animate()
					// Force it to always be true
					queue: true,
					duration: duration,
					complete: callback && function() {
						callback.call(elem, targ, settings);
					}
				});
				$elem.animate(attr, opts);
			}
		});
	};

	// Max scrolling position, works on quirks mode
	// It only fails (not too badly) on IE, quirks mode.
	$scrollTo.max = function(elem, axis) {
		var Dim = axis === 'x' ? 'Width' : 'Height',
			scroll = 'scroll'+Dim;

		if (!isWin(elem))
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();

		var size = 'client' + Dim,
			doc = elem.ownerDocument || elem.document,
			html = doc.documentElement,
			body = doc.body;

		return Math.max(html[scroll], body[scroll]) - Math.min(html[size], body[size]);
	};

	function both(val) {
		return $.isFunction(val) || $.isPlainObject(val) ? val : { top:val, left:val };
	}

	// Add special hooks so that window scroll properties can be animated
	$.Tween.propHooks.scrollLeft = 
	$.Tween.propHooks.scrollTop = {
		get: function(t) {
			return $(t.elem)[t.prop]();
		},
		set: function(t) {
			var curr = this.get(t);
			// If interrupt is true and user scrolled, stop animating
			if (t.options.interrupt && t._last && t._last !== curr) {
				return $(t.elem).stop();
			}
			var next = Math.round(t.now);
			// Don't waste CPU
			// Browsers don't render floating point scroll
			if (curr !== next) {
				$(t.elem)[t.prop](next);
				t._last = this.get(t);
			}
		}
	};

	// AMD requirement
	return $scrollTo;
});


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class WikipediaApi {
    // with namespace, with underscores, without spaces
    getPageNameFull() {
        return mw.config.get('wgPageName');
    }

    // without namespace, without underscores, with spaces
    getPageName() {
        return mw.config.get('wgTitle');
    }

    isMainNamespace() {
        return mw.config.get('wgNamespaceNumber') === 0;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WikipediaApi;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings__ = __webpack_require__(7);



const replacesURL = __WEBPACK_IMPORTED_MODULE_1__settings__["a" /* BACKEND_HOST */] + '/cache';
const generateURL = __WEBPACK_IMPORTED_MODULE_1__settings__["a" /* BACKEND_HOST */] + '/generate';

class Backend {
    async getRandomPageName() {
        let errorMessage = 'Не удалось получить следующую страницу для ёфикации';
        return await Object(__WEBPACK_IMPORTED_MODULE_0__base__["b" /* fetchJson */])(__WEBPACK_IMPORTED_MODULE_1__settings__["a" /* BACKEND_HOST */] + '/randomPageName', {errorMessage});
    }

    async getReplaces(pageName) {
        let errorMessage = 'Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)';
        return await Object(__WEBPACK_IMPORTED_MODULE_0__base__["b" /* fetchJson */])(__WEBPACK_IMPORTED_MODULE_1__settings__["a" /* BACKEND_HOST */] + '/getReplaces/' + pageName, {errorMessage});
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Backend;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// export const BACKEND_HOST = 'https://yofication.diraria.ru';
const BACKEND_HOST = 'http://localhost/wikipedia';
/* harmony export (immutable) */ __webpack_exports__["a"] = BACKEND_HOST;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__toast__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(1);



class Yofication {
    constructor(continuousYofication) {
        this.continuousYofication = continuousYofication;
    }

    async perform() {
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Загружаем список замен...');
        let {replaces, revision} = await this.backend.getReplaces(this.wikipediaApi.getPageName());
        if (revision !== mw.config.get('wgCurRevisionId')) {
            throw `revision doesn't match`;
        }

        replaces = replaces.filter(replace => replace.frequency >= settings.minReplaceFrequency * 100);
        if (replaces.length === 0) {
            Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)');
            Object(__WEBPACK_IMPORTED_MODULE_1__base__["c" /* removeArgumentsFromUrl */])();
            return Promise.resolve();
        }
        replaces.forEach(replace => replace.isAccept = false);

        let textDiv = $('#mw-content-text');
        let text = textDiv.html();
        let iReplace = -1;
        let done = false;
        this.goToNextReplace();
        $(window).on('resize', this.scrollToReplace);

        let actions = {
            'j': acceptReplace,
            'о': acceptReplace,
            'f': rejectReplace,
            'а': rejectReplace,
            // ещё раз показать последнюю замену
            ';': showCurrentReplaceAgain,
            'ж': showCurrentReplaceAgain,
            // вернуться к предыдущей замене
            'a': goToPreviousReplace,
            'ф': goToPreviousReplace
        };

        $(document).keypress((event) => {
                if (!done && event.key in actions) {
                    actions[event.key]();
                }
            }
        );
    }

    goToNextReplace() {
        while (!goToReplace(++iReplace)) {}
    }

    goToPreviousReplace() {
        --iReplace;
        while (iReplace >= 0 && !goToReplace(iReplace)) {
            --iReplace;
        }
        if (iReplace < 0) {
            iReplace = 0;
            throw 'goToPreviousReplace: iReplace < 0';
        }
        replaces[iReplace].isAccept = false;
    }

    makeChange(callback) {
        done = true;
        let replacesRight = replaces.filter(replace => replace.isAccept);
        if (replacesRight.length === 0) {
            callback();
            return;
        }
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Делаем правку: \nЗагружаем викитекст страницы...');
        WikiText(function (wikitext) {
                Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Делаем правку: \nПрименяем замены...');
                let replaceSomething = false;
                for (let i = 0; i < replacesRight.length; ++i) {
                    let replace = replacesRight[i];
                    let eword = replace.eword;
                    if (wikitext.substr(replace.indexWordStart, eword.length) !== eword.deyofication()) {
                        exit('Ошибка: викитекст страницы "' + currentPageTitle + '" не совпадает в индексе ' + replace.indexWordStart
                            + '\nПожалуйста, сообщите название этой страницы [[Участник:Дима74|автору скрипта]].'
                            + '\nожидается: "' + eword.deyofication() + '"'
                            + '\nполучено: "' + wikitext.substr(replace.indexWordStart, eword.length) + '"', false);
                        return;
                    }
                    wikitext = wikitext.insert(replace.indexWordStart, eword, eword.length);
                    replaceSomething = true;
                }

                if (replaceSomething) {
                    Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Делаем правку: \nОтправляем изменения...');
                    editPage({
                        title: currentPageTitle,
                        text: wikitext,
                        summary: editSummary
                    }, callback);
                }
            }
        );
    }

    goToReplace(iReplace) {
        if (iReplace === replaces.length) {
            textDiv.html(text);
            makeChange(continuousYofication ? goToNextPage : __WEBPACK_IMPORTED_MODULE_1__base__["c" /* removeArgumentsFromUrl */]);
            return true;
        }
        if (iReplace > replaces.length) {
            throw 'goToReplace: iReplace > replaces.length';
        }

        let replace = replaces[iReplace];
        let eword = replace.eword;
        let status = 'Замена ' + (iReplace + 1) + ' из ' + replaces.length + '\n' + eword + '\nЧастота: ' + replace.frequency + '%';
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])(status);
        let indexes = text.getIndexesOf(eword.deyofication());

        // игнорируем вхождения dword внутри слов
        indexes = indexes.filter(function (i) {
                let j = i + eword.length;
                return (i === 0 || !text[i - 1].isRussianLetterInWord()) && (j === text.length || !text[j].isRussianLetterInWord());
            }
        );

        // выделяем цветом
        if (indexes.length !== replace.numberSameDwords) {
            Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])(status + '\nПредупреждение: не совпадает numberSameDwords\nНайдено: ' + indexes.length + '\nДолжно быть: ' + replace.numberSameDwords + ' \n(индексы найденных: ' + indexes + ')');
            return false;
        }
        let indexWordStart = indexes[replace.numberSameDwordsBefore];
        let textNew = text.insert(indexWordStart, '<span style="background: cyan;" id="yofication-replace">' + eword + '</span>', eword.length);
        textDiv.html(textNew);

        // проверяем на видимость
        if (!$('#yofication-replace').is(':visible')) {
            console.log('Предупреждение: замена не видна');
            return false;
        }

        // скроллим
        scrollToReplace();
        return true;
    }

    acceptReplace() {
        replaces[iReplace].isAccept = true;
        goToNextReplace();
    }

    rejectReplace() {
        goToNextReplace();
    }

    showCurrentReplaceAgain() {
        scrollToReplace();
    }

    scrollToReplace() {
        let replace = $('#yofication-replace');
        if (replace.length) {
            $.scrollTo(replace, {over: 0.5, offset: -$(window).height() / 2});
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Yofication;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWJkYmM2ZTc0Y2JkYTA4NmUxNzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RvYXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcXVlcnkuc2Nyb2xsdG8vanF1ZXJ5LnNjcm9sbFRvLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImpRdWVyeVwiIiwid2VicGFjazovLy8uL3NyYy93aWtpcGVkaWEtYXBpLmpzIiwid2VicGFjazovLy8uL3NyYy9iYWNrZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMveW9maWNhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUM3RGU7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QjtBQUNBLHdDO0FBQ0EsbUM7QUFDQSx3QjtBQUNBLCtCO0FBQ0EsK0I7QUFDQSwwQjtBQUNBLDRCO0FBQ0EsdUI7QUFDQSxzQjtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwwQkFBMEI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsMkNBQTJDO0FBQzVFO0FBQ0E7QUFDQSxDIiwiZmlsZSI6InlvZmljYXRvci5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlYmRiYzZlNzRjYmRhMDg2ZTE3NCIsImltcG9ydCB7YXNzZXJ0fSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBTTkFDS0JBUl9IVE1MID0gYFxuICAgIDxkaXYgXG4gICAgICAgIGlkPVwieW9maWNhdG9yLXNuYWNrYmFyXCIgXG4gICAgICAgIHN0eWxlPVwiXG4gICAgICAgICAgICBtaW4td2lkdGg6IDI1MHB4OyBcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTsgXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzOyBcbiAgICAgICAgICAgIGNvbG9yOiAjZmZmOyBcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjsgXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7IFxuICAgICAgICAgICAgcGFkZGluZzogMTZweDsgXG4gICAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7IFxuICAgICAgICAgICAgei1pbmRleDogMTsgXG4gICAgICAgICAgICBsZWZ0OiA1MCU7IFxuICAgICAgICAgICAgYm90dG9tOiAzMHB4O1wiXG4gICAgPtCh0L/QsNGB0LjQsdC+LCDRh9GC0L4g0LLQvtGB0L/QvtC70YzQt9C+0LLQsNC70LjRgdGMINGR0YTQuNC60LDRgtC+0YDQvtC8ITwvZGl2PmA7XG4kKCdib2R5JykuYXBwZW5kKFNOQUNLQkFSX0hUTUwpO1xuXG4vLyB0b2RvINGD0LHRgNCw0YLRjCBgZXJyb3JgXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b2FzdChzdGF0dXMsIGVycm9yID0gbnVsbCkge1xuICAgIGNvbnNvbGUubG9nKHN0YXR1cyk7XG4gICAgbGV0IHNuYWNrYmFyID0gJCgnI3lvZmljYXRvci1zbmFja2JhcicpO1xuICAgIGFzc2VydChzbmFja2Jhci5sZW5ndGggPT09IDEpO1xuICAgIGlmIChlcnJvciAhPT0gbnVsbCkge1xuICAgICAgICBzdGF0dXMgKz0gJ1xcbtCf0L7QttCw0LvRg9C50YHRgtCwLCDQv9C+0L/RgNC+0LHRg9C50YLQtSDQvtCx0L3QvtCy0LjRgtGMINGB0YLRgNCw0L3QuNGG0YMuIFxcbtCV0YHQu9C4INGN0YLQviDQvdC1INC/0L7QvNC+0LbQtdGCLCDRgdCy0Y/QttC40YLQtdGB0Ywg0YEgW1vQo9GH0LDRgdGC0L3QuNC6OtCU0LjQvNCwNzR80LDQstGC0L7RgNC+0Lwg0YHQutGA0LjQv9GC0LBdXS4nO1xuICAgIH1cblxuICAgIHN0YXR1cyA9IHN0YXR1cy5yZXBsYWNlKC9cXG4vZywgJzxiciAvPicpO1xuICAgIC8vIFtb0YHRgdGL0LvQutCwfNC40LzRj11dIC0+IDxhIGhyZWY9XCIvd2lraS/RgdGB0YvQu9C60LBcIj7QuNC80Y88L2E+XG4gICAgc3RhdHVzID0gc3RhdHVzLnJlcGxhY2UoL1xcW1xcWyhbXnxdKilcXHwoW15cXF1dKildXS9nLCAnPGEgaHJlZj1cIi93aWtpLyQxXCIgc3R5bGU9XCJjb2xvcjogIzBmZjtcIj4kMjwvYT4nKTtcbiAgICBzbmFja2Jhci5odG1sKHN0YXR1cyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdG9hc3QuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHRvYXN0IGZyb20gJy4vdG9hc3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0KGV4cHJlc3Npb24sIG1lc3NhZ2UgPSAn0J3QtdC/0YDQtdC00LLQuNC00LXQvdC90LDRjyDQvtGI0LjQsdC60LAnKSB7XG4gICAgaWYgKCFleHByZXNzaW9uKSB7XG4gICAgICAgIHRvYXN0KG1lc3NhZ2UpO1xuICAgICAgICB0aHJvdyBtZXNzYWdlO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSnNvbih1cmwsIGluZm8pIHtcbiAgICBpbmZvID0gT2JqZWN0LmFzc2lnbih7ZXJyb3JNZXNzYWdlOiAndG9kbyd9LCBpbmZvKTtcblxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgZmV0Y2godXJsKSkuanNvbigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdG9hc3QoaW5mby5lcnJvck1lc3NhZ2UpO1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFyZ3VtZW50c0Zyb21VcmwoKSB7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKCcnLCAnJywgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgnP3lvZmljYXRpb24nLCAnJykpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Jhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICdqcXVlcnkuc2Nyb2xsdG8nO1xuaW1wb3J0IFdpa2lwZWRpYUFwaSBmcm9tICcuL3dpa2lwZWRpYS1hcGknO1xuaW1wb3J0IHRvYXN0IGZyb20gJy4vdG9hc3QnO1xuaW1wb3J0IEJhY2tlbmQgZnJvbSAnLi9iYWNrZW5kJztcbmltcG9ydCBZb2ZpY2F0aW9uIGZyb20gJy4veW9maWNhdGlvbic7XG5cbmNvbnN0IHNldHRpbmdzID0ge1xuICAgIGFkZFBvcnRsZXRMaW5rQWN0aW9uOiB0eXBlb2YgRWZpY2F0b3JfQWRkUG9ydGxldExpbmtBY3Rpb24gPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IEVmaWNhdG9yX0FkZFBvcnRsZXRlTGlua0FjdGlvbixcbiAgICBlZGl0U3VtbWFyeTogdHlwZW9mIEVmaWNhdG9yX0VkaXRTdW1tYXJ5ID09PSAndW5kZWZpbmVkJyA/ICfQgdGE0LjQutCw0YbQuNGPINGBINC/0L7QvNC+0YnRjNGOIFtb0KPRh9Cw0YHRgtC90LjQujrQlNC40LzQsDc0L9Ch0LrRgNC40L/Rgi3QgdGE0LjQutCw0YLQvtGAfNGB0LrRgNC40L/RgtCwLdGR0YTQuNC60LDRgtC+0YDQsF1dJyA6IEVmaWNhdG9yX0VkaXRTdW1tYXJ5LFxuICAgIG1pblJlcGxhY2VGcmVxdWVuY3k6IHR5cGVvZiBFZmljYXRvcl9NaW5SZXBsYWNlRnJlcXVlbmN5ID09PSAndW5kZWZpbmVkJyA/IDYwIDogRWZpY2F0b3JfTWluUmVwbGFjZUZyZXF1ZW5jeVxufTtcblxuY2xhc3MgTWFpbiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMud2lraXBlZGlhQXBpID0gbmV3IFdpa2lwZWRpYUFwaSgpO1xuICAgICAgICB0aGlzLmJhY2tlbmQgPSBuZXcgQmFja2VuZCgpO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnBlcmZvcm1Db250aW51b3VzWW9maWNhdGlvbigpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMud2lraXBlZGlhQXBpLmdldFBhZ2VOYW1lRnVsbCgpID09PSAn0KHQu9GD0LbQtdCx0L3QsNGPOtCB0YTQuNC60LDRhtC40Y8nKSB7XG4gICAgICAgICAgICB0aGlzLnBlcmZvcm1Db250aW51b3VzWW9maWNhdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guaW5jbHVkZXMoJ3lvZmljYXRpb24nKSkge1xuICAgICAgICAgICAgbGV0IGNvbnRpbnVvdXNZb2ZpY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5pbmNsdWRlcygnY29udGludW91c195b2ZpY2F0aW9uJyk7XG4gICAgICAgICAgICBuZXcgWW9maWNhdGlvbihjb250aW51b3VzWW9maWNhdGlvbikucGVyZm9ybSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmFkZFBvcnRsZXRMaW5rQWN0aW9uICYmIHRoaXMud2lraXBlZGlhQXBpLmlzTWFpbk5hbWVzcGFjZSgpKSB7XG4gICAgICAgICAgICBtdy51dGlsLmFkZFBvcnRsZXRMaW5rKCdwLWNhY3Rpb25zJywgJy93aWtpLycgKyB0aGlzLndpa2lwZWRpYUFwaS5nZXRQYWdlTmFtZUZ1bGwoKSArICc/eW9maWNhdGlvbicsICfQgdGE0LjRhtC40YDQvtCy0LDRgtGMJywgJ2NhLWVmaWNhdG9yJywgJyDQgdGE0LjRhtC40YDQvtCy0LDRgtGMINGB0YLRgNCw0L3QuNGG0YMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHBlcmZvcm1Db250aW51b3VzWW9maWNhdGlvbigpIHtcbiAgICAgICAgdG9hc3QoJ9Cf0LXRgNC10YXQvtC00LjQvCDQuiDRgdC70LXQtNGD0Y7RidC10Lkg0YHRgtGA0LDQvdC40YbQtTogXFxu0JfQsNCz0YDRg9C20LDQtdC8INC90LDQt9Cy0LDQvdC40LUg0YHRgtCw0YLRjNC4INC00LvRjyDRkdGE0LjQutCw0YbQuNC4Li4uJyk7XG4gICAgICAgIGxldCBwYWdlTmFtZSA9IGF3YWl0IHRoaXMuYmFja2VuZC5nZXRSYW5kb21QYWdlTmFtZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhwYWdlTmFtZSk7XG4gICAgICAgIC8vIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2h0dHBzOi8vcnUud2lraXBlZGlhLm9yZy93aWtpLycgKyBwYWdlTmFtZSArICc/Y29udGludW91c195b2ZpY2F0aW9uJztcbiAgICB9XG59XG5cbmV4cG9ydCBsZXQgbWFpbiA9IG5ldyBNYWluKCk7XG5tYWluLnN0YXJ0KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiFcbiAqIGpRdWVyeS5zY3JvbGxUb1xuICogQ29weXJpZ2h0IChjKSAyMDA3LTIwMTUgQXJpZWwgRmxlc2xlciAtIGFmbGVzbGVyPGE+Z21haWw8ZD5jb20gfCBodHRwOi8vZmxlc2xlci5ibG9nc3BvdC5jb21cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVFxuICogaHR0cDovL2ZsZXNsZXIuYmxvZ3Nwb3QuY29tLzIwMDcvMTAvanF1ZXJ5c2Nyb2xsdG8uaHRtbFxuICogQHByb2plY3REZXNjcmlwdGlvbiBMaWdodHdlaWdodCwgY3Jvc3MtYnJvd3NlciBhbmQgaGlnaGx5IGN1c3RvbWl6YWJsZSBhbmltYXRlZCBzY3JvbGxpbmcgd2l0aCBqUXVlcnlcbiAqIEBhdXRob3IgQXJpZWwgRmxlc2xlclxuICogQHZlcnNpb24gMi4xLjJcbiAqL1xuOyhmdW5jdGlvbihmYWN0b3J5KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcblx0fSBlbHNlIHtcblx0XHQvLyBHbG9iYWxcblx0XHRmYWN0b3J5KGpRdWVyeSk7XG5cdH1cbn0pKGZ1bmN0aW9uKCQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciAkc2Nyb2xsVG8gPSAkLnNjcm9sbFRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgc2V0dGluZ3MpIHtcblx0XHRyZXR1cm4gJCh3aW5kb3cpLnNjcm9sbFRvKHRhcmdldCwgZHVyYXRpb24sIHNldHRpbmdzKTtcblx0fTtcblxuXHQkc2Nyb2xsVG8uZGVmYXVsdHMgPSB7XG5cdFx0YXhpczoneHknLFxuXHRcdGR1cmF0aW9uOiAwLFxuXHRcdGxpbWl0OnRydWVcblx0fTtcblxuXHRmdW5jdGlvbiBpc1dpbihlbGVtKSB7XG5cdFx0cmV0dXJuICFlbGVtLm5vZGVOYW1lIHx8XG5cdFx0XHQkLmluQXJyYXkoZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLCBbJ2lmcmFtZScsJyNkb2N1bWVudCcsJ2h0bWwnLCdib2R5J10pICE9PSAtMTtcblx0fVx0XHRcblxuXHQkLmZuLnNjcm9sbFRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgc2V0dGluZ3MpIHtcblx0XHRpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnb2JqZWN0Jykge1xuXHRcdFx0c2V0dGluZ3MgPSBkdXJhdGlvbjtcblx0XHRcdGR1cmF0aW9uID0gMDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBzZXR0aW5ncyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0c2V0dGluZ3MgPSB7IG9uQWZ0ZXI6c2V0dGluZ3MgfTtcblx0XHR9XG5cdFx0aWYgKHRhcmdldCA9PT0gJ21heCcpIHtcblx0XHRcdHRhcmdldCA9IDllOTtcblx0XHR9XG5cblx0XHRzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCAkc2Nyb2xsVG8uZGVmYXVsdHMsIHNldHRpbmdzKTtcblx0XHQvLyBTcGVlZCBpcyBzdGlsbCByZWNvZ25pemVkIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuXHRcdGR1cmF0aW9uID0gZHVyYXRpb24gfHwgc2V0dGluZ3MuZHVyYXRpb247XG5cdFx0Ly8gTWFrZSBzdXJlIHRoZSBzZXR0aW5ncyBhcmUgZ2l2ZW4gcmlnaHRcblx0XHR2YXIgcXVldWUgPSBzZXR0aW5ncy5xdWV1ZSAmJiBzZXR0aW5ncy5heGlzLmxlbmd0aCA+IDE7XG5cdFx0aWYgKHF1ZXVlKSB7XG5cdFx0XHQvLyBMZXQncyBrZWVwIHRoZSBvdmVyYWxsIGR1cmF0aW9uXG5cdFx0XHRkdXJhdGlvbiAvPSAyO1xuXHRcdH1cblx0XHRzZXR0aW5ncy5vZmZzZXQgPSBib3RoKHNldHRpbmdzLm9mZnNldCk7XG5cdFx0c2V0dGluZ3Mub3ZlciA9IGJvdGgoc2V0dGluZ3Mub3Zlcik7XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gTnVsbCB0YXJnZXQgeWllbGRzIG5vdGhpbmcsIGp1c3QgbGlrZSBqUXVlcnkgZG9lc1xuXHRcdFx0aWYgKHRhcmdldCA9PT0gbnVsbCkgcmV0dXJuO1xuXG5cdFx0XHR2YXIgd2luID0gaXNXaW4odGhpcyksXG5cdFx0XHRcdGVsZW0gPSB3aW4gPyB0aGlzLmNvbnRlbnRXaW5kb3cgfHwgd2luZG93IDogdGhpcyxcblx0XHRcdFx0JGVsZW0gPSAkKGVsZW0pLFxuXHRcdFx0XHR0YXJnID0gdGFyZ2V0LCBcblx0XHRcdFx0YXR0ciA9IHt9LFxuXHRcdFx0XHR0b2ZmO1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGVvZiB0YXJnKSB7XG5cdFx0XHRcdC8vIEEgbnVtYmVyIHdpbGwgcGFzcyB0aGUgcmVnZXhcblx0XHRcdFx0Y2FzZSAnbnVtYmVyJzpcblx0XHRcdFx0Y2FzZSAnc3RyaW5nJzpcblx0XHRcdFx0XHRpZiAoL14oWystXT0/KT9cXGQrKFxcLlxcZCspPyhweHwlKT8kLy50ZXN0KHRhcmcpKSB7XG5cdFx0XHRcdFx0XHR0YXJnID0gYm90aCh0YXJnKTtcblx0XHRcdFx0XHRcdC8vIFdlIGFyZSBkb25lXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gUmVsYXRpdmUvQWJzb2x1dGUgc2VsZWN0b3Jcblx0XHRcdFx0XHR0YXJnID0gd2luID8gJCh0YXJnKSA6ICQodGFyZywgZWxlbSk7XG5cdFx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0XHRjYXNlICdvYmplY3QnOlxuXHRcdFx0XHRcdGlmICh0YXJnLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRcdFx0XHRcdC8vIERPTUVsZW1lbnQgLyBqUXVlcnlcblx0XHRcdFx0XHRpZiAodGFyZy5pcyB8fCB0YXJnLnN0eWxlKSB7XG5cdFx0XHRcdFx0XHQvLyBHZXQgdGhlIHJlYWwgcG9zaXRpb24gb2YgdGhlIHRhcmdldFxuXHRcdFx0XHRcdFx0dG9mZiA9ICh0YXJnID0gJCh0YXJnKSkub2Zmc2V0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgb2Zmc2V0ID0gJC5pc0Z1bmN0aW9uKHNldHRpbmdzLm9mZnNldCkgJiYgc2V0dGluZ3Mub2Zmc2V0KGVsZW0sIHRhcmcpIHx8IHNldHRpbmdzLm9mZnNldDtcblxuXHRcdFx0JC5lYWNoKHNldHRpbmdzLmF4aXMuc3BsaXQoJycpLCBmdW5jdGlvbihpLCBheGlzKSB7XG5cdFx0XHRcdHZhciBQb3NcdD0gYXhpcyA9PT0gJ3gnID8gJ0xlZnQnIDogJ1RvcCcsXG5cdFx0XHRcdFx0cG9zID0gUG9zLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0a2V5ID0gJ3Njcm9sbCcgKyBQb3MsXG5cdFx0XHRcdFx0cHJldiA9ICRlbGVtW2tleV0oKSxcblx0XHRcdFx0XHRtYXggPSAkc2Nyb2xsVG8ubWF4KGVsZW0sIGF4aXMpO1xuXG5cdFx0XHRcdGlmICh0b2ZmKSB7Ly8galF1ZXJ5IC8gRE9NRWxlbWVudFxuXHRcdFx0XHRcdGF0dHJba2V5XSA9IHRvZmZbcG9zXSArICh3aW4gPyAwIDogcHJldiAtICRlbGVtLm9mZnNldCgpW3Bvc10pO1xuXG5cdFx0XHRcdFx0Ly8gSWYgaXQncyBhIGRvbSBlbGVtZW50LCByZWR1Y2UgdGhlIG1hcmdpblxuXHRcdFx0XHRcdGlmIChzZXR0aW5ncy5tYXJnaW4pIHtcblx0XHRcdFx0XHRcdGF0dHJba2V5XSAtPSBwYXJzZUludCh0YXJnLmNzcygnbWFyZ2luJytQb3MpLCAxMCkgfHwgMDtcblx0XHRcdFx0XHRcdGF0dHJba2V5XSAtPSBwYXJzZUludCh0YXJnLmNzcygnYm9yZGVyJytQb3MrJ1dpZHRoJyksIDEwKSB8fCAwO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGF0dHJba2V5XSArPSBvZmZzZXRbcG9zXSB8fCAwO1xuXG5cdFx0XHRcdFx0aWYgKHNldHRpbmdzLm92ZXJbcG9zXSkge1xuXHRcdFx0XHRcdFx0Ly8gU2Nyb2xsIHRvIGEgZnJhY3Rpb24gb2YgaXRzIHdpZHRoL2hlaWdodFxuXHRcdFx0XHRcdFx0YXR0cltrZXldICs9IHRhcmdbYXhpcyA9PT0gJ3gnPyd3aWR0aCc6J2hlaWdodCddKCkgKiBzZXR0aW5ncy5vdmVyW3Bvc107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciB2YWwgPSB0YXJnW3Bvc107XG5cdFx0XHRcdFx0Ly8gSGFuZGxlIHBlcmNlbnRhZ2UgdmFsdWVzXG5cdFx0XHRcdFx0YXR0cltrZXldID0gdmFsLnNsaWNlICYmIHZhbC5zbGljZSgtMSkgPT09ICclJyA/XG5cdFx0XHRcdFx0XHRwYXJzZUZsb2F0KHZhbCkgLyAxMDAgKiBtYXhcblx0XHRcdFx0XHRcdDogdmFsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTnVtYmVyIG9yICdudW1iZXInXG5cdFx0XHRcdGlmIChzZXR0aW5ncy5saW1pdCAmJiAvXlxcZCskLy50ZXN0KGF0dHJba2V5XSkpIHtcblx0XHRcdFx0XHQvLyBDaGVjayB0aGUgbGltaXRzXG5cdFx0XHRcdFx0YXR0cltrZXldID0gYXR0cltrZXldIDw9IDAgPyAwIDogTWF0aC5taW4oYXR0cltrZXldLCBtYXgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRG9uJ3Qgd2FzdGUgdGltZSBhbmltYXRpbmcsIGlmIHRoZXJlJ3Mgbm8gbmVlZC5cblx0XHRcdFx0aWYgKCFpICYmIHNldHRpbmdzLmF4aXMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdGlmIChwcmV2ID09PSBhdHRyW2tleV0pIHtcblx0XHRcdFx0XHRcdC8vIE5vIGFuaW1hdGlvbiBuZWVkZWRcblx0XHRcdFx0XHRcdGF0dHIgPSB7fTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHF1ZXVlKSB7XG5cdFx0XHRcdFx0XHQvLyBJbnRlcm1lZGlhdGUgYW5pbWF0aW9uXG5cdFx0XHRcdFx0XHRhbmltYXRlKHNldHRpbmdzLm9uQWZ0ZXJGaXJzdCk7XG5cdFx0XHRcdFx0XHQvLyBEb24ndCBhbmltYXRlIHRoaXMgYXhpcyBhZ2FpbiBpbiB0aGUgbmV4dCBpdGVyYXRpb24uXG5cdFx0XHRcdFx0XHRhdHRyID0ge307XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YW5pbWF0ZShzZXR0aW5ncy5vbkFmdGVyKTtcblxuXHRcdFx0ZnVuY3Rpb24gYW5pbWF0ZShjYWxsYmFjaykge1xuXHRcdFx0XHR2YXIgb3B0cyA9ICQuZXh0ZW5kKHt9LCBzZXR0aW5ncywge1xuXHRcdFx0XHRcdC8vIFRoZSBxdWV1ZSBzZXR0aW5nIGNvbmZsaWN0cyB3aXRoIGFuaW1hdGUoKVxuXHRcdFx0XHRcdC8vIEZvcmNlIGl0IHRvIGFsd2F5cyBiZSB0cnVlXG5cdFx0XHRcdFx0cXVldWU6IHRydWUsXG5cdFx0XHRcdFx0ZHVyYXRpb246IGR1cmF0aW9uLFxuXHRcdFx0XHRcdGNvbXBsZXRlOiBjYWxsYmFjayAmJiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoZWxlbSwgdGFyZywgc2V0dGluZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRlbGVtLmFuaW1hdGUoYXR0ciwgb3B0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0Ly8gTWF4IHNjcm9sbGluZyBwb3NpdGlvbiwgd29ya3Mgb24gcXVpcmtzIG1vZGVcblx0Ly8gSXQgb25seSBmYWlscyAobm90IHRvbyBiYWRseSkgb24gSUUsIHF1aXJrcyBtb2RlLlxuXHQkc2Nyb2xsVG8ubWF4ID0gZnVuY3Rpb24oZWxlbSwgYXhpcykge1xuXHRcdHZhciBEaW0gPSBheGlzID09PSAneCcgPyAnV2lkdGgnIDogJ0hlaWdodCcsXG5cdFx0XHRzY3JvbGwgPSAnc2Nyb2xsJytEaW07XG5cblx0XHRpZiAoIWlzV2luKGVsZW0pKVxuXHRcdFx0cmV0dXJuIGVsZW1bc2Nyb2xsXSAtICQoZWxlbSlbRGltLnRvTG93ZXJDYXNlKCldKCk7XG5cblx0XHR2YXIgc2l6ZSA9ICdjbGllbnQnICsgRGltLFxuXHRcdFx0ZG9jID0gZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0uZG9jdW1lbnQsXG5cdFx0XHRodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudCxcblx0XHRcdGJvZHkgPSBkb2MuYm9keTtcblxuXHRcdHJldHVybiBNYXRoLm1heChodG1sW3Njcm9sbF0sIGJvZHlbc2Nyb2xsXSkgLSBNYXRoLm1pbihodG1sW3NpemVdLCBib2R5W3NpemVdKTtcblx0fTtcblxuXHRmdW5jdGlvbiBib3RoKHZhbCkge1xuXHRcdHJldHVybiAkLmlzRnVuY3Rpb24odmFsKSB8fCAkLmlzUGxhaW5PYmplY3QodmFsKSA/IHZhbCA6IHsgdG9wOnZhbCwgbGVmdDp2YWwgfTtcblx0fVxuXG5cdC8vIEFkZCBzcGVjaWFsIGhvb2tzIHNvIHRoYXQgd2luZG93IHNjcm9sbCBwcm9wZXJ0aWVzIGNhbiBiZSBhbmltYXRlZFxuXHQkLlR3ZWVuLnByb3BIb29rcy5zY3JvbGxMZWZ0ID0gXG5cdCQuVHdlZW4ucHJvcEhvb2tzLnNjcm9sbFRvcCA9IHtcblx0XHRnZXQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRcdHJldHVybiAkKHQuZWxlbSlbdC5wcm9wXSgpO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbih0KSB7XG5cdFx0XHR2YXIgY3VyciA9IHRoaXMuZ2V0KHQpO1xuXHRcdFx0Ly8gSWYgaW50ZXJydXB0IGlzIHRydWUgYW5kIHVzZXIgc2Nyb2xsZWQsIHN0b3AgYW5pbWF0aW5nXG5cdFx0XHRpZiAodC5vcHRpb25zLmludGVycnVwdCAmJiB0Ll9sYXN0ICYmIHQuX2xhc3QgIT09IGN1cnIpIHtcblx0XHRcdFx0cmV0dXJuICQodC5lbGVtKS5zdG9wKCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgbmV4dCA9IE1hdGgucm91bmQodC5ub3cpO1xuXHRcdFx0Ly8gRG9uJ3Qgd2FzdGUgQ1BVXG5cdFx0XHQvLyBCcm93c2VycyBkb24ndCByZW5kZXIgZmxvYXRpbmcgcG9pbnQgc2Nyb2xsXG5cdFx0XHRpZiAoY3VyciAhPT0gbmV4dCkge1xuXHRcdFx0XHQkKHQuZWxlbSlbdC5wcm9wXShuZXh0KTtcblx0XHRcdFx0dC5fbGFzdCA9IHRoaXMuZ2V0KHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBBTUQgcmVxdWlyZW1lbnRcblx0cmV0dXJuICRzY3JvbGxUbztcbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvanF1ZXJ5LnNjcm9sbHRvL2pxdWVyeS5zY3JvbGxUby5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IGpRdWVyeTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImpRdWVyeVwiXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdpa2lwZWRpYUFwaSB7XG4gICAgLy8gd2l0aCBuYW1lc3BhY2UsIHdpdGggdW5kZXJzY29yZXMsIHdpdGhvdXQgc3BhY2VzXG4gICAgZ2V0UGFnZU5hbWVGdWxsKCkge1xuICAgICAgICByZXR1cm4gbXcuY29uZmlnLmdldCgnd2dQYWdlTmFtZScpO1xuICAgIH1cblxuICAgIC8vIHdpdGhvdXQgbmFtZXNwYWNlLCB3aXRob3V0IHVuZGVyc2NvcmVzLCB3aXRoIHNwYWNlc1xuICAgIGdldFBhZ2VOYW1lKCkge1xuICAgICAgICByZXR1cm4gbXcuY29uZmlnLmdldCgnd2dUaXRsZScpO1xuICAgIH1cblxuICAgIGlzTWFpbk5hbWVzcGFjZSgpIHtcbiAgICAgICAgcmV0dXJuIG13LmNvbmZpZy5nZXQoJ3dnTmFtZXNwYWNlTnVtYmVyJykgPT09IDA7XG4gICAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3dpa2lwZWRpYS1hcGkuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtmZXRjaEpzb259IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge0JBQ0tFTkRfSE9TVH0gZnJvbSAnLi9zZXR0aW5ncyc7XG5cbmNvbnN0IHJlcGxhY2VzVVJMID0gQkFDS0VORF9IT1NUICsgJy9jYWNoZSc7XG5jb25zdCBnZW5lcmF0ZVVSTCA9IEJBQ0tFTkRfSE9TVCArICcvZ2VuZXJhdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYWNrZW5kIHtcbiAgICBhc3luYyBnZXRSYW5kb21QYWdlTmFtZSgpIHtcbiAgICAgICAgbGV0IGVycm9yTWVzc2FnZSA9ICfQndC1INGD0LTQsNC70L7RgdGMINC/0L7Qu9GD0YfQuNGC0Ywg0YHQu9C10LTRg9GO0YnRg9GOINGB0YLRgNCw0L3QuNGG0YMg0LTQu9GPINGR0YTQuNC60LDRhtC40LgnO1xuICAgICAgICByZXR1cm4gYXdhaXQgZmV0Y2hKc29uKEJBQ0tFTkRfSE9TVCArICcvcmFuZG9tUGFnZU5hbWUnLCB7ZXJyb3JNZXNzYWdlfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0UmVwbGFjZXMocGFnZU5hbWUpIHtcbiAgICAgICAgbGV0IGVycm9yTWVzc2FnZSA9ICfQrdGC0LAg0YHRgtGA0LDQvdC40YbQsCDQuCDRgtCw0Log0YPQttC1INGR0YTQuNGG0LjRgNC+0LLQsNC90LAuIFxcbijQndC1INC90LDQudC00LXQvdC+INC30LDQvNC10L0g0LTQu9GPINGN0YLQvtC5INGB0YLRgNCw0L3QuNGG0YspJztcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZldGNoSnNvbihCQUNLRU5EX0hPU1QgKyAnL2dldFJlcGxhY2VzLycgKyBwYWdlTmFtZSwge2Vycm9yTWVzc2FnZX0pO1xuICAgIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9iYWNrZW5kLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIGV4cG9ydCBjb25zdCBCQUNLRU5EX0hPU1QgPSAnaHR0cHM6Ly95b2ZpY2F0aW9uLmRpcmFyaWEucnUnO1xuZXhwb3J0IGNvbnN0IEJBQ0tFTkRfSE9TVCA9ICdodHRwOi8vbG9jYWxob3N0L3dpa2lwZWRpYSc7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2V0dGluZ3MuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHRvYXN0IGZyb20gJy4vdG9hc3QnO1xuaW1wb3J0IHtyZW1vdmVBcmd1bWVudHNGcm9tVXJsfSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBZb2ZpY2F0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250aW51b3VzWW9maWNhdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRpbnVvdXNZb2ZpY2F0aW9uID0gY29udGludW91c1lvZmljYXRpb247XG4gICAgfVxuXG4gICAgYXN5bmMgcGVyZm9ybSgpIHtcbiAgICAgICAgdG9hc3QoJ9CX0LDQs9GA0YPQttCw0LXQvCDRgdC/0LjRgdC+0Log0LfQsNC80LXQvS4uLicpO1xuICAgICAgICBsZXQge3JlcGxhY2VzLCByZXZpc2lvbn0gPSBhd2FpdCB0aGlzLmJhY2tlbmQuZ2V0UmVwbGFjZXModGhpcy53aWtpcGVkaWFBcGkuZ2V0UGFnZU5hbWUoKSk7XG4gICAgICAgIGlmIChyZXZpc2lvbiAhPT0gbXcuY29uZmlnLmdldCgnd2dDdXJSZXZpc2lvbklkJykpIHtcbiAgICAgICAgICAgIHRocm93IGByZXZpc2lvbiBkb2Vzbid0IG1hdGNoYDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcGxhY2VzID0gcmVwbGFjZXMuZmlsdGVyKHJlcGxhY2UgPT4gcmVwbGFjZS5mcmVxdWVuY3kgPj0gc2V0dGluZ3MubWluUmVwbGFjZUZyZXF1ZW5jeSAqIDEwMCk7XG4gICAgICAgIGlmIChyZXBsYWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRvYXN0KCfQrdGC0LAg0YHRgtGA0LDQvdC40YbQsCDQuCDRgtCw0Log0YPQttC1INGR0YTQuNGG0LjRgNC+0LLQsNC90LAuIFxcbijQndC1INC90LDQudC00LXQvdC+INC30LDQvNC10L0g0LTQu9GPINGN0YLQvtC5INGB0YLRgNCw0L3QuNGG0YspJyk7XG4gICAgICAgICAgICByZW1vdmVBcmd1bWVudHNGcm9tVXJsKCk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVwbGFjZXMuZm9yRWFjaChyZXBsYWNlID0+IHJlcGxhY2UuaXNBY2NlcHQgPSBmYWxzZSk7XG5cbiAgICAgICAgbGV0IHRleHREaXYgPSAkKCcjbXctY29udGVudC10ZXh0Jyk7XG4gICAgICAgIGxldCB0ZXh0ID0gdGV4dERpdi5odG1sKCk7XG4gICAgICAgIGxldCBpUmVwbGFjZSA9IC0xO1xuICAgICAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdvVG9OZXh0UmVwbGFjZSgpO1xuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHRoaXMuc2Nyb2xsVG9SZXBsYWNlKTtcblxuICAgICAgICBsZXQgYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICdqJzogYWNjZXB0UmVwbGFjZSxcbiAgICAgICAgICAgICfQvic6IGFjY2VwdFJlcGxhY2UsXG4gICAgICAgICAgICAnZic6IHJlamVjdFJlcGxhY2UsXG4gICAgICAgICAgICAn0LAnOiByZWplY3RSZXBsYWNlLFxuICAgICAgICAgICAgLy8g0LXRidGRINGA0LDQtyDQv9C+0LrQsNC30LDRgtGMINC/0L7RgdC70LXQtNC90Y7RjiDQt9Cw0LzQtdC90YNcbiAgICAgICAgICAgICc7Jzogc2hvd0N1cnJlbnRSZXBsYWNlQWdhaW4sXG4gICAgICAgICAgICAn0LYnOiBzaG93Q3VycmVudFJlcGxhY2VBZ2FpbixcbiAgICAgICAgICAgIC8vINCy0LXRgNC90YPRgtGM0YHRjyDQuiDQv9GA0LXQtNGL0LTRg9GJ0LXQuSDQt9Cw0LzQtdC90LVcbiAgICAgICAgICAgICdhJzogZ29Ub1ByZXZpb3VzUmVwbGFjZSxcbiAgICAgICAgICAgICfRhCc6IGdvVG9QcmV2aW91c1JlcGxhY2VcbiAgICAgICAgfTtcblxuICAgICAgICAkKGRvY3VtZW50KS5rZXlwcmVzcygoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWRvbmUgJiYgZXZlbnQua2V5IGluIGFjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uc1tldmVudC5rZXldKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdvVG9OZXh0UmVwbGFjZSgpIHtcbiAgICAgICAgd2hpbGUgKCFnb1RvUmVwbGFjZSgrK2lSZXBsYWNlKSkge31cbiAgICB9XG5cbiAgICBnb1RvUHJldmlvdXNSZXBsYWNlKCkge1xuICAgICAgICAtLWlSZXBsYWNlO1xuICAgICAgICB3aGlsZSAoaVJlcGxhY2UgPj0gMCAmJiAhZ29Ub1JlcGxhY2UoaVJlcGxhY2UpKSB7XG4gICAgICAgICAgICAtLWlSZXBsYWNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpUmVwbGFjZSA8IDApIHtcbiAgICAgICAgICAgIGlSZXBsYWNlID0gMDtcbiAgICAgICAgICAgIHRocm93ICdnb1RvUHJldmlvdXNSZXBsYWNlOiBpUmVwbGFjZSA8IDAnO1xuICAgICAgICB9XG4gICAgICAgIHJlcGxhY2VzW2lSZXBsYWNlXS5pc0FjY2VwdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG1ha2VDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIGxldCByZXBsYWNlc1JpZ2h0ID0gcmVwbGFjZXMuZmlsdGVyKHJlcGxhY2UgPT4gcmVwbGFjZS5pc0FjY2VwdCk7XG4gICAgICAgIGlmIChyZXBsYWNlc1JpZ2h0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0b2FzdCgn0JTQtdC70LDQtdC8INC/0YDQsNCy0LrRgzogXFxu0JfQsNCz0YDRg9C20LDQtdC8INCy0LjQutC40YLQtdC60YHRgiDRgdGC0YDQsNC90LjRhtGLLi4uJyk7XG4gICAgICAgIFdpa2lUZXh0KGZ1bmN0aW9uICh3aWtpdGV4dCkge1xuICAgICAgICAgICAgICAgIHRvYXN0KCfQlNC10LvQsNC10Lwg0L/RgNCw0LLQutGDOiBcXG7Qn9GA0LjQvNC10L3Rj9C10Lwg0LfQsNC80LXQvdGLLi4uJyk7XG4gICAgICAgICAgICAgICAgbGV0IHJlcGxhY2VTb21ldGhpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcGxhY2VzUmlnaHQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlcGxhY2UgPSByZXBsYWNlc1JpZ2h0W2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXdvcmQgPSByZXBsYWNlLmV3b3JkO1xuICAgICAgICAgICAgICAgICAgICBpZiAod2lraXRleHQuc3Vic3RyKHJlcGxhY2UuaW5kZXhXb3JkU3RhcnQsIGV3b3JkLmxlbmd0aCkgIT09IGV3b3JkLmRleW9maWNhdGlvbigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGl0KCfQntGI0LjQsdC60LA6INCy0LjQutC40YLQtdC60YHRgiDRgdGC0YDQsNC90LjRhtGLIFwiJyArIGN1cnJlbnRQYWdlVGl0bGUgKyAnXCIg0L3QtSDRgdC+0LLQv9Cw0LTQsNC10YIg0LIg0LjQvdC00LXQutGB0LUgJyArIHJlcGxhY2UuaW5kZXhXb3JkU3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICdcXG7Qn9C+0LbQsNC70YPQudGB0YLQsCwg0YHQvtC+0LHRidC40YLQtSDQvdCw0LfQstCw0L3QuNC1INGN0YLQvtC5INGB0YLRgNCw0L3QuNGG0YsgW1vQo9GH0LDRgdGC0L3QuNC6OtCU0LjQvNCwNzR80LDQstGC0L7RgNGDINGB0LrRgNC40L/RgtCwXV0uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ1xcbtC+0LbQuNC00LDQtdGC0YHRjzogXCInICsgZXdvcmQuZGV5b2ZpY2F0aW9uKCkgKyAnXCInXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFxu0L/QvtC70YPRh9C10L3QvjogXCInICsgd2lraXRleHQuc3Vic3RyKHJlcGxhY2UuaW5kZXhXb3JkU3RhcnQsIGV3b3JkLmxlbmd0aCkgKyAnXCInLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgd2lraXRleHQgPSB3aWtpdGV4dC5pbnNlcnQocmVwbGFjZS5pbmRleFdvcmRTdGFydCwgZXdvcmQsIGV3b3JkLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VTb21ldGhpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXBsYWNlU29tZXRoaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0KCfQlNC10LvQsNC10Lwg0L/RgNCw0LLQutGDOiBcXG7QntGC0L/RgNCw0LLQu9GP0LXQvCDQuNC30LzQtdC90LXQvdC40Y8uLi4nKTtcbiAgICAgICAgICAgICAgICAgICAgZWRpdFBhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGN1cnJlbnRQYWdlVGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB3aWtpdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bW1hcnk6IGVkaXRTdW1tYXJ5XG4gICAgICAgICAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ29Ub1JlcGxhY2UoaVJlcGxhY2UpIHtcbiAgICAgICAgaWYgKGlSZXBsYWNlID09PSByZXBsYWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRleHREaXYuaHRtbCh0ZXh0KTtcbiAgICAgICAgICAgIG1ha2VDaGFuZ2UoY29udGludW91c1lvZmljYXRpb24gPyBnb1RvTmV4dFBhZ2UgOiByZW1vdmVBcmd1bWVudHNGcm9tVXJsKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpUmVwbGFjZSA+IHJlcGxhY2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgJ2dvVG9SZXBsYWNlOiBpUmVwbGFjZSA+IHJlcGxhY2VzLmxlbmd0aCc7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVwbGFjZSA9IHJlcGxhY2VzW2lSZXBsYWNlXTtcbiAgICAgICAgbGV0IGV3b3JkID0gcmVwbGFjZS5ld29yZDtcbiAgICAgICAgbGV0IHN0YXR1cyA9ICfQl9Cw0LzQtdC90LAgJyArIChpUmVwbGFjZSArIDEpICsgJyDQuNC3ICcgKyByZXBsYWNlcy5sZW5ndGggKyAnXFxuJyArIGV3b3JkICsgJ1xcbtCn0LDRgdGC0L7RgtCwOiAnICsgcmVwbGFjZS5mcmVxdWVuY3kgKyAnJSc7XG4gICAgICAgIHRvYXN0KHN0YXR1cyk7XG4gICAgICAgIGxldCBpbmRleGVzID0gdGV4dC5nZXRJbmRleGVzT2YoZXdvcmQuZGV5b2ZpY2F0aW9uKCkpO1xuXG4gICAgICAgIC8vINC40LPQvdC+0YDQuNGA0YPQtdC8INCy0YXQvtC20LTQtdC90LjRjyBkd29yZCDQstC90YPRgtGA0Lgg0YHQu9C+0LJcbiAgICAgICAgaW5kZXhlcyA9IGluZGV4ZXMuZmlsdGVyKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGogPSBpICsgZXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHJldHVybiAoaSA9PT0gMCB8fCAhdGV4dFtpIC0gMV0uaXNSdXNzaWFuTGV0dGVySW5Xb3JkKCkpICYmIChqID09PSB0ZXh0Lmxlbmd0aCB8fCAhdGV4dFtqXS5pc1J1c3NpYW5MZXR0ZXJJbldvcmQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8g0LLRi9C00LXQu9GP0LXQvCDRhtCy0LXRgtC+0LxcbiAgICAgICAgaWYgKGluZGV4ZXMubGVuZ3RoICE9PSByZXBsYWNlLm51bWJlclNhbWVEd29yZHMpIHtcbiAgICAgICAgICAgIHRvYXN0KHN0YXR1cyArICdcXG7Qn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1OiDQvdC1INGB0L7QstC/0LDQtNCw0LXRgiBudW1iZXJTYW1lRHdvcmRzXFxu0J3QsNC50LTQtdC90L46ICcgKyBpbmRleGVzLmxlbmd0aCArICdcXG7QlNC+0LvQttC90L4g0LHRi9GC0Yw6ICcgKyByZXBsYWNlLm51bWJlclNhbWVEd29yZHMgKyAnIFxcbijQuNC90LTQtdC60YHRiyDQvdCw0LnQtNC10L3QvdGL0YU6ICcgKyBpbmRleGVzICsgJyknKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW5kZXhXb3JkU3RhcnQgPSBpbmRleGVzW3JlcGxhY2UubnVtYmVyU2FtZUR3b3Jkc0JlZm9yZV07XG4gICAgICAgIGxldCB0ZXh0TmV3ID0gdGV4dC5pbnNlcnQoaW5kZXhXb3JkU3RhcnQsICc8c3BhbiBzdHlsZT1cImJhY2tncm91bmQ6IGN5YW47XCIgaWQ9XCJ5b2ZpY2F0aW9uLXJlcGxhY2VcIj4nICsgZXdvcmQgKyAnPC9zcGFuPicsIGV3b3JkLmxlbmd0aCk7XG4gICAgICAgIHRleHREaXYuaHRtbCh0ZXh0TmV3KTtcblxuICAgICAgICAvLyDQv9GA0L7QstC10YDRj9C10Lwg0L3QsCDQstC40LTQuNC80L7RgdGC0YxcbiAgICAgICAgaWYgKCEkKCcjeW9maWNhdGlvbi1yZXBsYWNlJykuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1OiDQt9Cw0LzQtdC90LAg0L3QtSDQstC40LTQvdCwJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDRgdC60YDQvtC70LvQuNC8XG4gICAgICAgIHNjcm9sbFRvUmVwbGFjZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhY2NlcHRSZXBsYWNlKCkge1xuICAgICAgICByZXBsYWNlc1tpUmVwbGFjZV0uaXNBY2NlcHQgPSB0cnVlO1xuICAgICAgICBnb1RvTmV4dFJlcGxhY2UoKTtcbiAgICB9XG5cbiAgICByZWplY3RSZXBsYWNlKCkge1xuICAgICAgICBnb1RvTmV4dFJlcGxhY2UoKTtcbiAgICB9XG5cbiAgICBzaG93Q3VycmVudFJlcGxhY2VBZ2FpbigpIHtcbiAgICAgICAgc2Nyb2xsVG9SZXBsYWNlKCk7XG4gICAgfVxuXG4gICAgc2Nyb2xsVG9SZXBsYWNlKCkge1xuICAgICAgICBsZXQgcmVwbGFjZSA9ICQoJyN5b2ZpY2F0aW9uLXJlcGxhY2UnKTtcbiAgICAgICAgaWYgKHJlcGxhY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAkLnNjcm9sbFRvKHJlcGxhY2UsIHtvdmVyOiAwLjUsIG9mZnNldDogLSQod2luZG93KS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy95b2ZpY2F0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=
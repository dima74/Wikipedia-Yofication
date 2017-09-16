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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__yofication__ = __webpack_require__(7);






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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings__ = __webpack_require__(8);



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


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// export const BACKEND_HOST = 'https://yofication.diraria.ru';
const BACKEND_HOST = 'http://localhost';
/* harmony export (immutable) */ __webpack_exports__["a"] = BACKEND_HOST;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmQ4ZDBlYjlkZDFiOTQ3ZTZhOTMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RvYXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcXVlcnkuc2Nyb2xsdG8vanF1ZXJ5LnNjcm9sbFRvLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImpRdWVyeVwiIiwid2VicGFjazovLy8uL3NyYy93aWtpcGVkaWEtYXBpLmpzIiwid2VicGFjazovLy8uL3NyYy9iYWNrZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy95b2ZpY2F0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUM3RGU7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QjtBQUNBLHdDO0FBQ0EsbUM7QUFDQSx3QjtBQUNBLCtCO0FBQ0EsK0I7QUFDQSwwQjtBQUNBLDRCO0FBQ0EsdUI7QUFDQSxzQjtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwwQkFBMEI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsMkNBQTJDO0FBQzVFO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUN0S0E7QUFDQSx3QyIsImZpbGUiOiJ5b2ZpY2F0b3IuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZmQ4ZDBlYjlkZDFiOTQ3ZTZhOTMiLCJpbXBvcnQge2Fzc2VydH0gZnJvbSAnLi9iYXNlJztcblxuY29uc3QgU05BQ0tCQVJfSFRNTCA9IGBcbiAgICA8ZGl2IFxuICAgICAgICBpZD1cInlvZmljYXRvci1zbmFja2JhclwiIFxuICAgICAgICBzdHlsZT1cIlxuICAgICAgICAgICAgbWluLXdpZHRoOiAyNTBweDsgXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7IFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzMzMzsgXG4gICAgICAgICAgICBjb2xvcjogI2ZmZjsgXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IFxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4OyBcbiAgICAgICAgICAgIHBhZGRpbmc6IDE2cHg7IFxuICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkOyBcbiAgICAgICAgICAgIHotaW5kZXg6IDE7IFxuICAgICAgICAgICAgbGVmdDogNTAlOyBcbiAgICAgICAgICAgIGJvdHRvbTogMzBweDtcIlxuICAgID7QodC/0LDRgdC40LHQviwg0YfRgtC+INCy0L7RgdC/0L7Qu9GM0LfQvtCy0LDQu9C40YHRjCDRkdGE0LjQutCw0YLQvtGA0L7QvCE8L2Rpdj5gO1xuJCgnYm9keScpLmFwcGVuZChTTkFDS0JBUl9IVE1MKTtcblxuLy8gdG9kbyDRg9Cx0YDQsNGC0YwgYGVycm9yYFxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9hc3Qoc3RhdHVzLCBlcnJvciA9IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xuICAgIGxldCBzbmFja2JhciA9ICQoJyN5b2ZpY2F0b3Itc25hY2tiYXInKTtcbiAgICBhc3NlcnQoc25hY2tiYXIubGVuZ3RoID09PSAxKTtcbiAgICBpZiAoZXJyb3IgIT09IG51bGwpIHtcbiAgICAgICAgc3RhdHVzICs9ICdcXG7Qn9C+0LbQsNC70YPQudGB0YLQsCwg0L/QvtC/0YDQvtCx0YPQudGC0LUg0L7QsdC90L7QstC40YLRjCDRgdGC0YDQsNC90LjRhtGDLiBcXG7QldGB0LvQuCDRjdGC0L4g0L3QtSDQv9C+0LzQvtC20LXRgiwg0YHQstGP0LbQuNGC0LXRgdGMINGBIFtb0KPRh9Cw0YHRgtC90LjQujrQlNC40LzQsDc0fNCw0LLRgtC+0YDQvtC8INGB0LrRgNC40L/RgtCwXV0uJztcbiAgICB9XG5cbiAgICBzdGF0dXMgPSBzdGF0dXMucmVwbGFjZSgvXFxuL2csICc8YnIgLz4nKTtcbiAgICAvLyBbW9GB0YHRi9C70LrQsHzQuNC80Y9dXSAtPiA8YSBocmVmPVwiL3dpa2kv0YHRgdGL0LvQutCwXCI+0LjQvNGPPC9hPlxuICAgIHN0YXR1cyA9IHN0YXR1cy5yZXBsYWNlKC9cXFtcXFsoW158XSopXFx8KFteXFxdXSopXV0vZywgJzxhIGhyZWY9XCIvd2lraS8kMVwiIHN0eWxlPVwiY29sb3I6ICMwZmY7XCI+JDI8L2E+Jyk7XG4gICAgc25hY2tiYXIuaHRtbChzdGF0dXMpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3RvYXN0LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB0b2FzdCBmcm9tICcuL3RvYXN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydChleHByZXNzaW9uLCBtZXNzYWdlID0gJ9Cd0LXQv9GA0LXQtNCy0LjQtNC10L3QvdCw0Y8g0L7RiNC40LHQutCwJykge1xuICAgIGlmICghZXhwcmVzc2lvbikge1xuICAgICAgICB0b2FzdChtZXNzYWdlKTtcbiAgICAgICAgdGhyb3cgbWVzc2FnZTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEpzb24odXJsLCBpbmZvKSB7XG4gICAgaW5mbyA9IE9iamVjdC5hc3NpZ24oe2Vycm9yTWVzc2FnZTogJ3RvZG8nfSwgaW5mbyk7XG5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gKGF3YWl0IGZldGNoKHVybCkpLmpzb24oKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRvYXN0KGluZm8uZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVBcmd1bWVudHNGcm9tVXJsKCkge1xuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoJz95b2ZpY2F0aW9uJywgJycpKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAnanF1ZXJ5LnNjcm9sbHRvJztcbmltcG9ydCBXaWtpcGVkaWFBcGkgZnJvbSAnLi93aWtpcGVkaWEtYXBpJztcbmltcG9ydCB0b2FzdCBmcm9tICcuL3RvYXN0JztcbmltcG9ydCBCYWNrZW5kIGZyb20gJy4vYmFja2VuZCc7XG5pbXBvcnQgWW9maWNhdGlvbiBmcm9tICcuL3lvZmljYXRpb24nO1xuXG5jb25zdCBzZXR0aW5ncyA9IHtcbiAgICBhZGRQb3J0bGV0TGlua0FjdGlvbjogdHlwZW9mIEVmaWNhdG9yX0FkZFBvcnRsZXRMaW5rQWN0aW9uID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiBFZmljYXRvcl9BZGRQb3J0bGV0ZUxpbmtBY3Rpb24sXG4gICAgZWRpdFN1bW1hcnk6IHR5cGVvZiBFZmljYXRvcl9FZGl0U3VtbWFyeSA9PT0gJ3VuZGVmaW5lZCcgPyAn0IHRhNC40LrQsNGG0LjRjyDRgSDQv9C+0LzQvtGJ0YzRjiBbW9Cj0YfQsNGB0YLQvdC40Lo60JTQuNC80LA3NC/QodC60YDQuNC/0YIt0IHRhNC40LrQsNGC0L7RgHzRgdC60YDQuNC/0YLQsC3RkdGE0LjQutCw0YLQvtGA0LBdXScgOiBFZmljYXRvcl9FZGl0U3VtbWFyeSxcbiAgICBtaW5SZXBsYWNlRnJlcXVlbmN5OiB0eXBlb2YgRWZpY2F0b3JfTWluUmVwbGFjZUZyZXF1ZW5jeSA9PT0gJ3VuZGVmaW5lZCcgPyA2MCA6IEVmaWNhdG9yX01pblJlcGxhY2VGcmVxdWVuY3lcbn07XG5cbmNsYXNzIE1haW4ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLndpa2lwZWRpYUFwaSA9IG5ldyBXaWtpcGVkaWFBcGkoKTtcbiAgICAgICAgdGhpcy5iYWNrZW5kID0gbmV3IEJhY2tlbmQoKTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5wZXJmb3JtQ29udGludW91c1lvZmljYXRpb24oKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLndpa2lwZWRpYUFwaS5nZXRQYWdlTmFtZUZ1bGwoKSA9PT0gJ9Ch0LvRg9C20LXQsdC90LDRjzrQgdGE0LjQutCw0YbQuNGPJykge1xuICAgICAgICAgICAgdGhpcy5wZXJmb3JtQ29udGludW91c1lvZmljYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoLmluY2x1ZGVzKCd5b2ZpY2F0aW9uJykpIHtcbiAgICAgICAgICAgIGxldCBjb250aW51b3VzWW9maWNhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guaW5jbHVkZXMoJ2NvbnRpbnVvdXNfeW9maWNhdGlvbicpO1xuICAgICAgICAgICAgbmV3IFlvZmljYXRpb24oY29udGludW91c1lvZmljYXRpb24pLnBlcmZvcm0oKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZXR0aW5ncy5hZGRQb3J0bGV0TGlua0FjdGlvbiAmJiB0aGlzLndpa2lwZWRpYUFwaS5pc01haW5OYW1lc3BhY2UoKSkge1xuICAgICAgICAgICAgbXcudXRpbC5hZGRQb3J0bGV0TGluaygncC1jYWN0aW9ucycsICcvd2lraS8nICsgdGhpcy53aWtpcGVkaWFBcGkuZ2V0UGFnZU5hbWVGdWxsKCkgKyAnP3lvZmljYXRpb24nLCAn0IHRhNC40YbQuNGA0L7QstCw0YLRjCcsICdjYS1lZmljYXRvcicsICcg0IHRhNC40YbQuNGA0L7QstCw0YLRjCDRgdGC0YDQsNC90LjRhtGDJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBwZXJmb3JtQ29udGludW91c1lvZmljYXRpb24oKSB7XG4gICAgICAgIHRvYXN0KCfQn9C10YDQtdGF0L7QtNC40Lwg0Log0YHQu9C10LTRg9GO0YnQtdC5INGB0YLRgNCw0L3QuNGG0LU6IFxcbtCX0LDQs9GA0YPQttCw0LXQvCDQvdCw0LfQstCw0L3QuNC1INGB0YLQsNGC0YzQuCDQtNC70Y8g0ZHRhNC40LrQsNGG0LjQuC4uLicpO1xuICAgICAgICBsZXQgcGFnZU5hbWUgPSBhd2FpdCB0aGlzLmJhY2tlbmQuZ2V0UmFuZG9tUGFnZU5hbWUoKTtcbiAgICAgICAgY29uc29sZS5sb2cocGFnZU5hbWUpO1xuICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICdodHRwczovL3J1Lndpa2lwZWRpYS5vcmcvd2lraS8nICsgcGFnZU5hbWUgKyAnP2NvbnRpbnVvdXNfeW9maWNhdGlvbic7XG4gICAgfVxufVxuXG5leHBvcnQgbGV0IG1haW4gPSBuZXcgTWFpbigpO1xubWFpbi5zdGFydCgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyohXG4gKiBqUXVlcnkuc2Nyb2xsVG9cbiAqIENvcHlyaWdodCAoYykgMjAwNy0yMDE1IEFyaWVsIEZsZXNsZXIgLSBhZmxlc2xlcjxhPmdtYWlsPGQ+Y29tIHwgaHR0cDovL2ZsZXNsZXIuYmxvZ3Nwb3QuY29tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVRcbiAqIGh0dHA6Ly9mbGVzbGVyLmJsb2dzcG90LmNvbS8yMDA3LzEwL2pxdWVyeXNjcm9sbHRvLmh0bWxcbiAqIEBwcm9qZWN0RGVzY3JpcHRpb24gTGlnaHR3ZWlnaHQsIGNyb3NzLWJyb3dzZXIgYW5kIGhpZ2hseSBjdXN0b21pemFibGUgYW5pbWF0ZWQgc2Nyb2xsaW5nIHdpdGggalF1ZXJ5XG4gKiBAYXV0aG9yIEFyaWVsIEZsZXNsZXJcbiAqIEB2ZXJzaW9uIDIuMS4yXG4gKi9cbjsoZnVuY3Rpb24oZmFjdG9yeSkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gR2xvYmFsXG5cdFx0ZmFjdG9yeShqUXVlcnkpO1xuXHR9XG59KShmdW5jdGlvbigkKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgJHNjcm9sbFRvID0gJC5zY3JvbGxUbyA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHNldHRpbmdzKSB7XG5cdFx0cmV0dXJuICQod2luZG93KS5zY3JvbGxUbyh0YXJnZXQsIGR1cmF0aW9uLCBzZXR0aW5ncyk7XG5cdH07XG5cblx0JHNjcm9sbFRvLmRlZmF1bHRzID0ge1xuXHRcdGF4aXM6J3h5Jyxcblx0XHRkdXJhdGlvbjogMCxcblx0XHRsaW1pdDp0cnVlXG5cdH07XG5cblx0ZnVuY3Rpb24gaXNXaW4oZWxlbSkge1xuXHRcdHJldHVybiAhZWxlbS5ub2RlTmFtZSB8fFxuXHRcdFx0JC5pbkFycmF5KGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSwgWydpZnJhbWUnLCcjZG9jdW1lbnQnLCdodG1sJywnYm9keSddKSAhPT0gLTE7XG5cdH1cdFx0XG5cblx0JC5mbi5zY3JvbGxUbyA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHNldHRpbmdzKSB7XG5cdFx0aWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHNldHRpbmdzID0gZHVyYXRpb247XG5cdFx0XHRkdXJhdGlvbiA9IDA7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2Ygc2V0dGluZ3MgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHNldHRpbmdzID0geyBvbkFmdGVyOnNldHRpbmdzIH07XG5cdFx0fVxuXHRcdGlmICh0YXJnZXQgPT09ICdtYXgnKSB7XG5cdFx0XHR0YXJnZXQgPSA5ZTk7XG5cdFx0fVxuXG5cdFx0c2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgJHNjcm9sbFRvLmRlZmF1bHRzLCBzZXR0aW5ncyk7XG5cdFx0Ly8gU3BlZWQgaXMgc3RpbGwgcmVjb2duaXplZCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblx0XHRkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IHNldHRpbmdzLmR1cmF0aW9uO1xuXHRcdC8vIE1ha2Ugc3VyZSB0aGUgc2V0dGluZ3MgYXJlIGdpdmVuIHJpZ2h0XG5cdFx0dmFyIHF1ZXVlID0gc2V0dGluZ3MucXVldWUgJiYgc2V0dGluZ3MuYXhpcy5sZW5ndGggPiAxO1xuXHRcdGlmIChxdWV1ZSkge1xuXHRcdFx0Ly8gTGV0J3Mga2VlcCB0aGUgb3ZlcmFsbCBkdXJhdGlvblxuXHRcdFx0ZHVyYXRpb24gLz0gMjtcblx0XHR9XG5cdFx0c2V0dGluZ3Mub2Zmc2V0ID0gYm90aChzZXR0aW5ncy5vZmZzZXQpO1xuXHRcdHNldHRpbmdzLm92ZXIgPSBib3RoKHNldHRpbmdzLm92ZXIpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdC8vIE51bGwgdGFyZ2V0IHlpZWxkcyBub3RoaW5nLCBqdXN0IGxpa2UgalF1ZXJ5IGRvZXNcblx0XHRcdGlmICh0YXJnZXQgPT09IG51bGwpIHJldHVybjtcblxuXHRcdFx0dmFyIHdpbiA9IGlzV2luKHRoaXMpLFxuXHRcdFx0XHRlbGVtID0gd2luID8gdGhpcy5jb250ZW50V2luZG93IHx8IHdpbmRvdyA6IHRoaXMsXG5cdFx0XHRcdCRlbGVtID0gJChlbGVtKSxcblx0XHRcdFx0dGFyZyA9IHRhcmdldCwgXG5cdFx0XHRcdGF0dHIgPSB7fSxcblx0XHRcdFx0dG9mZjtcblxuXHRcdFx0c3dpdGNoICh0eXBlb2YgdGFyZykge1xuXHRcdFx0XHQvLyBBIG51bWJlciB3aWxsIHBhc3MgdGhlIHJlZ2V4XG5cdFx0XHRcdGNhc2UgJ251bWJlcic6XG5cdFx0XHRcdGNhc2UgJ3N0cmluZyc6XG5cdFx0XHRcdFx0aWYgKC9eKFsrLV09Pyk/XFxkKyhcXC5cXGQrKT8ocHh8JSk/JC8udGVzdCh0YXJnKSkge1xuXHRcdFx0XHRcdFx0dGFyZyA9IGJvdGgodGFyZyk7XG5cdFx0XHRcdFx0XHQvLyBXZSBhcmUgZG9uZVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIFJlbGF0aXZlL0Fic29sdXRlIHNlbGVjdG9yXG5cdFx0XHRcdFx0dGFyZyA9IHdpbiA/ICQodGFyZykgOiAkKHRhcmcsIGVsZW0pO1xuXHRcdFx0XHRcdC8qIGZhbGxzIHRocm91Z2ggKi9cblx0XHRcdFx0Y2FzZSAnb2JqZWN0Jzpcblx0XHRcdFx0XHRpZiAodGFyZy5sZW5ndGggPT09IDApIHJldHVybjtcblx0XHRcdFx0XHQvLyBET01FbGVtZW50IC8galF1ZXJ5XG5cdFx0XHRcdFx0aWYgKHRhcmcuaXMgfHwgdGFyZy5zdHlsZSkge1xuXHRcdFx0XHRcdFx0Ly8gR2V0IHRoZSByZWFsIHBvc2l0aW9uIG9mIHRoZSB0YXJnZXRcblx0XHRcdFx0XHRcdHRvZmYgPSAodGFyZyA9ICQodGFyZykpLm9mZnNldCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIG9mZnNldCA9ICQuaXNGdW5jdGlvbihzZXR0aW5ncy5vZmZzZXQpICYmIHNldHRpbmdzLm9mZnNldChlbGVtLCB0YXJnKSB8fCBzZXR0aW5ncy5vZmZzZXQ7XG5cblx0XHRcdCQuZWFjaChzZXR0aW5ncy5heGlzLnNwbGl0KCcnKSwgZnVuY3Rpb24oaSwgYXhpcykge1xuXHRcdFx0XHR2YXIgUG9zXHQ9IGF4aXMgPT09ICd4JyA/ICdMZWZ0JyA6ICdUb3AnLFxuXHRcdFx0XHRcdHBvcyA9IFBvcy50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdGtleSA9ICdzY3JvbGwnICsgUG9zLFxuXHRcdFx0XHRcdHByZXYgPSAkZWxlbVtrZXldKCksXG5cdFx0XHRcdFx0bWF4ID0gJHNjcm9sbFRvLm1heChlbGVtLCBheGlzKTtcblxuXHRcdFx0XHRpZiAodG9mZikgey8vIGpRdWVyeSAvIERPTUVsZW1lbnRcblx0XHRcdFx0XHRhdHRyW2tleV0gPSB0b2ZmW3Bvc10gKyAod2luID8gMCA6IHByZXYgLSAkZWxlbS5vZmZzZXQoKVtwb3NdKTtcblxuXHRcdFx0XHRcdC8vIElmIGl0J3MgYSBkb20gZWxlbWVudCwgcmVkdWNlIHRoZSBtYXJnaW5cblx0XHRcdFx0XHRpZiAoc2V0dGluZ3MubWFyZ2luKSB7XG5cdFx0XHRcdFx0XHRhdHRyW2tleV0gLT0gcGFyc2VJbnQodGFyZy5jc3MoJ21hcmdpbicrUG9zKSwgMTApIHx8IDA7XG5cdFx0XHRcdFx0XHRhdHRyW2tleV0gLT0gcGFyc2VJbnQodGFyZy5jc3MoJ2JvcmRlcicrUG9zKydXaWR0aCcpLCAxMCkgfHwgMDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRhdHRyW2tleV0gKz0gb2Zmc2V0W3Bvc10gfHwgMDtcblxuXHRcdFx0XHRcdGlmIChzZXR0aW5ncy5vdmVyW3Bvc10pIHtcblx0XHRcdFx0XHRcdC8vIFNjcm9sbCB0byBhIGZyYWN0aW9uIG9mIGl0cyB3aWR0aC9oZWlnaHRcblx0XHRcdFx0XHRcdGF0dHJba2V5XSArPSB0YXJnW2F4aXMgPT09ICd4Jz8nd2lkdGgnOidoZWlnaHQnXSgpICogc2V0dGluZ3Mub3Zlcltwb3NdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgdmFsID0gdGFyZ1twb3NdO1xuXHRcdFx0XHRcdC8vIEhhbmRsZSBwZXJjZW50YWdlIHZhbHVlc1xuXHRcdFx0XHRcdGF0dHJba2V5XSA9IHZhbC5zbGljZSAmJiB2YWwuc2xpY2UoLTEpID09PSAnJScgP1xuXHRcdFx0XHRcdFx0cGFyc2VGbG9hdCh2YWwpIC8gMTAwICogbWF4XG5cdFx0XHRcdFx0XHQ6IHZhbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE51bWJlciBvciAnbnVtYmVyJ1xuXHRcdFx0XHRpZiAoc2V0dGluZ3MubGltaXQgJiYgL15cXGQrJC8udGVzdChhdHRyW2tleV0pKSB7XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgdGhlIGxpbWl0c1xuXHRcdFx0XHRcdGF0dHJba2V5XSA9IGF0dHJba2V5XSA8PSAwID8gMCA6IE1hdGgubWluKGF0dHJba2V5XSwgbWF4KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIERvbid0IHdhc3RlIHRpbWUgYW5pbWF0aW5nLCBpZiB0aGVyZSdzIG5vIG5lZWQuXG5cdFx0XHRcdGlmICghaSAmJiBzZXR0aW5ncy5heGlzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRpZiAocHJldiA9PT0gYXR0cltrZXldKSB7XG5cdFx0XHRcdFx0XHQvLyBObyBhbmltYXRpb24gbmVlZGVkXG5cdFx0XHRcdFx0XHRhdHRyID0ge307XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChxdWV1ZSkge1xuXHRcdFx0XHRcdFx0Ly8gSW50ZXJtZWRpYXRlIGFuaW1hdGlvblxuXHRcdFx0XHRcdFx0YW5pbWF0ZShzZXR0aW5ncy5vbkFmdGVyRmlyc3QpO1xuXHRcdFx0XHRcdFx0Ly8gRG9uJ3QgYW5pbWF0ZSB0aGlzIGF4aXMgYWdhaW4gaW4gdGhlIG5leHQgaXRlcmF0aW9uLlxuXHRcdFx0XHRcdFx0YXR0ciA9IHt9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGFuaW1hdGUoc2V0dGluZ3Mub25BZnRlcik7XG5cblx0XHRcdGZ1bmN0aW9uIGFuaW1hdGUoY2FsbGJhY2spIHtcblx0XHRcdFx0dmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgc2V0dGluZ3MsIHtcblx0XHRcdFx0XHQvLyBUaGUgcXVldWUgc2V0dGluZyBjb25mbGljdHMgd2l0aCBhbmltYXRlKClcblx0XHRcdFx0XHQvLyBGb3JjZSBpdCB0byBhbHdheXMgYmUgdHJ1ZVxuXHRcdFx0XHRcdHF1ZXVlOiB0cnVlLFxuXHRcdFx0XHRcdGR1cmF0aW9uOiBkdXJhdGlvbixcblx0XHRcdFx0XHRjb21wbGV0ZTogY2FsbGJhY2sgJiYgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKGVsZW0sIHRhcmcsIHNldHRpbmdzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkZWxlbS5hbmltYXRlKGF0dHIsIG9wdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIE1heCBzY3JvbGxpbmcgcG9zaXRpb24sIHdvcmtzIG9uIHF1aXJrcyBtb2RlXG5cdC8vIEl0IG9ubHkgZmFpbHMgKG5vdCB0b28gYmFkbHkpIG9uIElFLCBxdWlya3MgbW9kZS5cblx0JHNjcm9sbFRvLm1heCA9IGZ1bmN0aW9uKGVsZW0sIGF4aXMpIHtcblx0XHR2YXIgRGltID0gYXhpcyA9PT0gJ3gnID8gJ1dpZHRoJyA6ICdIZWlnaHQnLFxuXHRcdFx0c2Nyb2xsID0gJ3Njcm9sbCcrRGltO1xuXG5cdFx0aWYgKCFpc1dpbihlbGVtKSlcblx0XHRcdHJldHVybiBlbGVtW3Njcm9sbF0gLSAkKGVsZW0pW0RpbS50b0xvd2VyQ2FzZSgpXSgpO1xuXG5cdFx0dmFyIHNpemUgPSAnY2xpZW50JyArIERpbSxcblx0XHRcdGRvYyA9IGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtLmRvY3VtZW50LFxuXHRcdFx0aHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQsXG5cdFx0XHRib2R5ID0gZG9jLmJvZHk7XG5cblx0XHRyZXR1cm4gTWF0aC5tYXgoaHRtbFtzY3JvbGxdLCBib2R5W3Njcm9sbF0pIC0gTWF0aC5taW4oaHRtbFtzaXplXSwgYm9keVtzaXplXSk7XG5cdH07XG5cblx0ZnVuY3Rpb24gYm90aCh2YWwpIHtcblx0XHRyZXR1cm4gJC5pc0Z1bmN0aW9uKHZhbCkgfHwgJC5pc1BsYWluT2JqZWN0KHZhbCkgPyB2YWwgOiB7IHRvcDp2YWwsIGxlZnQ6dmFsIH07XG5cdH1cblxuXHQvLyBBZGQgc3BlY2lhbCBob29rcyBzbyB0aGF0IHdpbmRvdyBzY3JvbGwgcHJvcGVydGllcyBjYW4gYmUgYW5pbWF0ZWRcblx0JC5Ud2Vlbi5wcm9wSG9va3Muc2Nyb2xsTGVmdCA9IFxuXHQkLlR3ZWVuLnByb3BIb29rcy5zY3JvbGxUb3AgPSB7XG5cdFx0Z2V0OiBmdW5jdGlvbih0KSB7XG5cdFx0XHRyZXR1cm4gJCh0LmVsZW0pW3QucHJvcF0oKTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24odCkge1xuXHRcdFx0dmFyIGN1cnIgPSB0aGlzLmdldCh0KTtcblx0XHRcdC8vIElmIGludGVycnVwdCBpcyB0cnVlIGFuZCB1c2VyIHNjcm9sbGVkLCBzdG9wIGFuaW1hdGluZ1xuXHRcdFx0aWYgKHQub3B0aW9ucy5pbnRlcnJ1cHQgJiYgdC5fbGFzdCAmJiB0Ll9sYXN0ICE9PSBjdXJyKSB7XG5cdFx0XHRcdHJldHVybiAkKHQuZWxlbSkuc3RvcCgpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG5leHQgPSBNYXRoLnJvdW5kKHQubm93KTtcblx0XHRcdC8vIERvbid0IHdhc3RlIENQVVxuXHRcdFx0Ly8gQnJvd3NlcnMgZG9uJ3QgcmVuZGVyIGZsb2F0aW5nIHBvaW50IHNjcm9sbFxuXHRcdFx0aWYgKGN1cnIgIT09IG5leHQpIHtcblx0XHRcdFx0JCh0LmVsZW0pW3QucHJvcF0obmV4dCk7XG5cdFx0XHRcdHQuX2xhc3QgPSB0aGlzLmdldCh0KTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gQU1EIHJlcXVpcmVtZW50XG5cdHJldHVybiAkc2Nyb2xsVG87XG59KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2pxdWVyeS5zY3JvbGx0by9qcXVlcnkuc2Nyb2xsVG8uanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJqUXVlcnlcIlxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXaWtpcGVkaWFBcGkge1xuICAgIC8vIHdpdGggbmFtZXNwYWNlLCB3aXRoIHVuZGVyc2NvcmVzLCB3aXRob3V0IHNwYWNlc1xuICAgIGdldFBhZ2VOYW1lRnVsbCgpIHtcbiAgICAgICAgcmV0dXJuIG13LmNvbmZpZy5nZXQoJ3dnUGFnZU5hbWUnKTtcbiAgICB9XG5cbiAgICAvLyB3aXRob3V0IG5hbWVzcGFjZSwgd2l0aG91dCB1bmRlcnNjb3Jlcywgd2l0aCBzcGFjZXNcbiAgICBnZXRQYWdlTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIG13LmNvbmZpZy5nZXQoJ3dnVGl0bGUnKTtcbiAgICB9XG5cbiAgICBpc01haW5OYW1lc3BhY2UoKSB7XG4gICAgICAgIHJldHVybiBtdy5jb25maWcuZ2V0KCd3Z05hbWVzcGFjZU51bWJlcicpID09PSAwO1xuICAgIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy93aWtpcGVkaWEtYXBpLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7ZmV0Y2hKc29ufSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtCQUNLRU5EX0hPU1R9IGZyb20gJy4vc2V0dGluZ3MnO1xuXG5jb25zdCByZXBsYWNlc1VSTCA9IEJBQ0tFTkRfSE9TVCArICcvY2FjaGUnO1xuY29uc3QgZ2VuZXJhdGVVUkwgPSBCQUNLRU5EX0hPU1QgKyAnL2dlbmVyYXRlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFja2VuZCB7XG4gICAgYXN5bmMgZ2V0UmFuZG9tUGFnZU5hbWUoKSB7XG4gICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSAn0J3QtSDRg9C00LDQu9C+0YHRjCDQv9C+0LvRg9GH0LjRgtGMINGB0LvQtdC00YPRjtGJ0YPRjiDRgdGC0YDQsNC90LjRhtGDINC00LvRjyDRkdGE0LjQutCw0YbQuNC4JztcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZldGNoSnNvbihCQUNLRU5EX0hPU1QgKyAnL3JhbmRvbVBhZ2VOYW1lJywge2Vycm9yTWVzc2FnZX0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFJlcGxhY2VzKHBhZ2VOYW1lKSB7XG4gICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSAn0K3RgtCwINGB0YLRgNCw0L3QuNGG0LAg0Lgg0YLQsNC6INGD0LbQtSDRkdGE0LjRhtC40YDQvtCy0LDQvdCwLiBcXG4o0J3QtSDQvdCw0LnQtNC10L3QviDQt9Cw0LzQtdC9INC00LvRjyDRjdGC0L7QuSDRgdGC0YDQsNC90LjRhtGLKSc7XG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaEpzb24oQkFDS0VORF9IT1NUICsgJy9nZXRSZXBsYWNlcy8nICsgcGFnZU5hbWUsIHtlcnJvck1lc3NhZ2V9KTtcbiAgICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYmFja2VuZC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgdG9hc3QgZnJvbSAnLi90b2FzdCc7XG5pbXBvcnQge3JlbW92ZUFyZ3VtZW50c0Zyb21Vcmx9IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlvZmljYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRpbnVvdXNZb2ZpY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuY29udGludW91c1lvZmljYXRpb24gPSBjb250aW51b3VzWW9maWNhdGlvbjtcbiAgICB9XG5cbiAgICBhc3luYyBwZXJmb3JtKCkge1xuICAgICAgICB0b2FzdCgn0JfQsNCz0YDRg9C20LDQtdC8INGB0L/QuNGB0L7QuiDQt9Cw0LzQtdC9Li4uJyk7XG4gICAgICAgIGxldCB7cmVwbGFjZXMsIHJldmlzaW9ufSA9IGF3YWl0IHRoaXMuYmFja2VuZC5nZXRSZXBsYWNlcyh0aGlzLndpa2lwZWRpYUFwaS5nZXRQYWdlTmFtZSgpKTtcbiAgICAgICAgaWYgKHJldmlzaW9uICE9PSBtdy5jb25maWcuZ2V0KCd3Z0N1clJldmlzaW9uSWQnKSkge1xuICAgICAgICAgICAgdGhyb3cgYHJldmlzaW9uIGRvZXNuJ3QgbWF0Y2hgO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVwbGFjZXMgPSByZXBsYWNlcy5maWx0ZXIocmVwbGFjZSA9PiByZXBsYWNlLmZyZXF1ZW5jeSA+PSBzZXR0aW5ncy5taW5SZXBsYWNlRnJlcXVlbmN5ICogMTAwKTtcbiAgICAgICAgaWYgKHJlcGxhY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdG9hc3QoJ9Ct0YLQsCDRgdGC0YDQsNC90LjRhtCwINC4INGC0LDQuiDRg9C20LUg0ZHRhNC40YbQuNGA0L7QstCw0L3QsC4gXFxuKNCd0LUg0L3QsNC50LTQtdC90L4g0LfQsNC80LXQvSDQtNC70Y8g0Y3RgtC+0Lkg0YHRgtGA0LDQvdC40YbRiyknKTtcbiAgICAgICAgICAgIHJlbW92ZUFyZ3VtZW50c0Zyb21VcmwoKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXBsYWNlcy5mb3JFYWNoKHJlcGxhY2UgPT4gcmVwbGFjZS5pc0FjY2VwdCA9IGZhbHNlKTtcblxuICAgICAgICBsZXQgdGV4dERpdiA9ICQoJyNtdy1jb250ZW50LXRleHQnKTtcbiAgICAgICAgbGV0IHRleHQgPSB0ZXh0RGl2Lmh0bWwoKTtcbiAgICAgICAgbGV0IGlSZXBsYWNlID0gLTE7XG4gICAgICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ29Ub05leHRSZXBsYWNlKCk7XG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgdGhpcy5zY3JvbGxUb1JlcGxhY2UpO1xuXG4gICAgICAgIGxldCBhY3Rpb25zID0ge1xuICAgICAgICAgICAgJ2onOiBhY2NlcHRSZXBsYWNlLFxuICAgICAgICAgICAgJ9C+JzogYWNjZXB0UmVwbGFjZSxcbiAgICAgICAgICAgICdmJzogcmVqZWN0UmVwbGFjZSxcbiAgICAgICAgICAgICfQsCc6IHJlamVjdFJlcGxhY2UsXG4gICAgICAgICAgICAvLyDQtdGJ0ZEg0YDQsNC3INC/0L7QutCw0LfQsNGC0Ywg0L/QvtGB0LvQtdC00L3RjtGOINC30LDQvNC10L3Rg1xuICAgICAgICAgICAgJzsnOiBzaG93Q3VycmVudFJlcGxhY2VBZ2FpbixcbiAgICAgICAgICAgICfQtic6IHNob3dDdXJyZW50UmVwbGFjZUFnYWluLFxuICAgICAgICAgICAgLy8g0LLQtdGA0L3Rg9GC0YzRgdGPINC6INC/0YDQtdC00YvQtNGD0YnQtdC5INC30LDQvNC10L3QtVxuICAgICAgICAgICAgJ2EnOiBnb1RvUHJldmlvdXNSZXBsYWNlLFxuICAgICAgICAgICAgJ9GEJzogZ29Ub1ByZXZpb3VzUmVwbGFjZVxuICAgICAgICB9O1xuXG4gICAgICAgICQoZG9jdW1lbnQpLmtleXByZXNzKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZG9uZSAmJiBldmVudC5rZXkgaW4gYWN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zW2V2ZW50LmtleV0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ29Ub05leHRSZXBsYWNlKCkge1xuICAgICAgICB3aGlsZSAoIWdvVG9SZXBsYWNlKCsraVJlcGxhY2UpKSB7fVxuICAgIH1cblxuICAgIGdvVG9QcmV2aW91c1JlcGxhY2UoKSB7XG4gICAgICAgIC0taVJlcGxhY2U7XG4gICAgICAgIHdoaWxlIChpUmVwbGFjZSA+PSAwICYmICFnb1RvUmVwbGFjZShpUmVwbGFjZSkpIHtcbiAgICAgICAgICAgIC0taVJlcGxhY2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlSZXBsYWNlIDwgMCkge1xuICAgICAgICAgICAgaVJlcGxhY2UgPSAwO1xuICAgICAgICAgICAgdGhyb3cgJ2dvVG9QcmV2aW91c1JlcGxhY2U6IGlSZXBsYWNlIDwgMCc7XG4gICAgICAgIH1cbiAgICAgICAgcmVwbGFjZXNbaVJlcGxhY2VdLmlzQWNjZXB0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbWFrZUNoYW5nZShjYWxsYmFjaykge1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgbGV0IHJlcGxhY2VzUmlnaHQgPSByZXBsYWNlcy5maWx0ZXIocmVwbGFjZSA9PiByZXBsYWNlLmlzQWNjZXB0KTtcbiAgICAgICAgaWYgKHJlcGxhY2VzUmlnaHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRvYXN0KCfQlNC10LvQsNC10Lwg0L/RgNCw0LLQutGDOiBcXG7Ql9Cw0LPRgNGD0LbQsNC10Lwg0LLQuNC60LjRgtC10LrRgdGCINGB0YLRgNCw0L3QuNGG0YsuLi4nKTtcbiAgICAgICAgV2lraVRleHQoZnVuY3Rpb24gKHdpa2l0ZXh0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QoJ9CU0LXQu9Cw0LXQvCDQv9GA0LDQstC60YM6IFxcbtCf0YDQuNC80LXQvdGP0LXQvCDQt9Cw0LzQtdC90YsuLi4nKTtcbiAgICAgICAgICAgICAgICBsZXQgcmVwbGFjZVNvbWV0aGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVwbGFjZXNSaWdodC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVwbGFjZSA9IHJlcGxhY2VzUmlnaHRbaV07XG4gICAgICAgICAgICAgICAgICAgIGxldCBld29yZCA9IHJlcGxhY2UuZXdvcmQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3aWtpdGV4dC5zdWJzdHIocmVwbGFjZS5pbmRleFdvcmRTdGFydCwgZXdvcmQubGVuZ3RoKSAhPT0gZXdvcmQuZGV5b2ZpY2F0aW9uKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXQoJ9Ce0YjQuNCx0LrQsDog0LLQuNC60LjRgtC10LrRgdGCINGB0YLRgNCw0L3QuNGG0YsgXCInICsgY3VycmVudFBhZ2VUaXRsZSArICdcIiDQvdC1INGB0L7QstC/0LDQtNCw0LXRgiDQsiDQuNC90LTQtdC60YHQtSAnICsgcmVwbGFjZS5pbmRleFdvcmRTdGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ1xcbtCf0L7QttCw0LvRg9C50YHRgtCwLCDRgdC+0L7QsdGJ0LjRgtC1INC90LDQt9Cy0LDQvdC40LUg0Y3RgtC+0Lkg0YHRgtGA0LDQvdC40YbRiyBbW9Cj0YfQsNGB0YLQvdC40Lo60JTQuNC80LA3NHzQsNCy0YLQvtGA0YMg0YHQutGA0LjQv9GC0LBdXS4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXFxu0L7QttC40LTQsNC10YLRgdGPOiBcIicgKyBld29yZC5kZXlvZmljYXRpb24oKSArICdcIidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICdcXG7Qv9C+0LvRg9GH0LXQvdC+OiBcIicgKyB3aWtpdGV4dC5zdWJzdHIocmVwbGFjZS5pbmRleFdvcmRTdGFydCwgZXdvcmQubGVuZ3RoKSArICdcIicsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB3aWtpdGV4dCA9IHdpa2l0ZXh0Lmluc2VydChyZXBsYWNlLmluZGV4V29yZFN0YXJ0LCBld29yZCwgZXdvcmQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVNvbWV0aGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlcGxhY2VTb21ldGhpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3QoJ9CU0LXQu9Cw0LXQvCDQv9GA0LDQstC60YM6IFxcbtCe0YLQv9GA0LDQstC70Y/QtdC8INC40LfQvNC10L3QtdC90LjRjy4uLicpO1xuICAgICAgICAgICAgICAgICAgICBlZGl0UGFnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogY3VycmVudFBhZ2VUaXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHdpa2l0ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VtbWFyeTogZWRpdFN1bW1hcnlcbiAgICAgICAgICAgICAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnb1RvUmVwbGFjZShpUmVwbGFjZSkge1xuICAgICAgICBpZiAoaVJlcGxhY2UgPT09IHJlcGxhY2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGV4dERpdi5odG1sKHRleHQpO1xuICAgICAgICAgICAgbWFrZUNoYW5nZShjb250aW51b3VzWW9maWNhdGlvbiA/IGdvVG9OZXh0UGFnZSA6IHJlbW92ZUFyZ3VtZW50c0Zyb21VcmwpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlSZXBsYWNlID4gcmVwbGFjZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyAnZ29Ub1JlcGxhY2U6IGlSZXBsYWNlID4gcmVwbGFjZXMubGVuZ3RoJztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXBsYWNlID0gcmVwbGFjZXNbaVJlcGxhY2VdO1xuICAgICAgICBsZXQgZXdvcmQgPSByZXBsYWNlLmV3b3JkO1xuICAgICAgICBsZXQgc3RhdHVzID0gJ9CX0LDQvNC10L3QsCAnICsgKGlSZXBsYWNlICsgMSkgKyAnINC40LcgJyArIHJlcGxhY2VzLmxlbmd0aCArICdcXG4nICsgZXdvcmQgKyAnXFxu0KfQsNGB0YLQvtGC0LA6ICcgKyByZXBsYWNlLmZyZXF1ZW5jeSArICclJztcbiAgICAgICAgdG9hc3Qoc3RhdHVzKTtcbiAgICAgICAgbGV0IGluZGV4ZXMgPSB0ZXh0LmdldEluZGV4ZXNPZihld29yZC5kZXlvZmljYXRpb24oKSk7XG5cbiAgICAgICAgLy8g0LjQs9C90L7RgNC40YDRg9C10Lwg0LLRhdC+0LbQtNC10L3QuNGPIGR3b3JkINCy0L3Rg9GC0YDQuCDRgdC70L7QslxuICAgICAgICBpbmRleGVzID0gaW5kZXhlcy5maWx0ZXIoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICBsZXQgaiA9IGkgKyBld29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSAwIHx8ICF0ZXh0W2kgLSAxXS5pc1J1c3NpYW5MZXR0ZXJJbldvcmQoKSkgJiYgKGogPT09IHRleHQubGVuZ3RoIHx8ICF0ZXh0W2pdLmlzUnVzc2lhbkxldHRlckluV29yZCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICAvLyDQstGL0LTQtdC70Y/QtdC8INGG0LLQtdGC0L7QvFxuICAgICAgICBpZiAoaW5kZXhlcy5sZW5ndGggIT09IHJlcGxhY2UubnVtYmVyU2FtZUR3b3Jkcykge1xuICAgICAgICAgICAgdG9hc3Qoc3RhdHVzICsgJ1xcbtCf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LU6INC90LUg0YHQvtCy0L/QsNC00LDQtdGCIG51bWJlclNhbWVEd29yZHNcXG7QndCw0LnQtNC10L3QvjogJyArIGluZGV4ZXMubGVuZ3RoICsgJ1xcbtCU0L7Qu9C20L3QviDQsdGL0YLRjDogJyArIHJlcGxhY2UubnVtYmVyU2FtZUR3b3JkcyArICcgXFxuKNC40L3QtNC10LrRgdGLINC90LDQudC00LXQvdC90YvRhTogJyArIGluZGV4ZXMgKyAnKScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpbmRleFdvcmRTdGFydCA9IGluZGV4ZXNbcmVwbGFjZS5udW1iZXJTYW1lRHdvcmRzQmVmb3JlXTtcbiAgICAgICAgbGV0IHRleHROZXcgPSB0ZXh0Lmluc2VydChpbmRleFdvcmRTdGFydCwgJzxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZDogY3lhbjtcIiBpZD1cInlvZmljYXRpb24tcmVwbGFjZVwiPicgKyBld29yZCArICc8L3NwYW4+JywgZXdvcmQubGVuZ3RoKTtcbiAgICAgICAgdGV4dERpdi5odG1sKHRleHROZXcpO1xuXG4gICAgICAgIC8vINC/0YDQvtCy0LXRgNGP0LXQvCDQvdCwINCy0LjQtNC40LzQvtGB0YLRjFxuICAgICAgICBpZiAoISQoJyN5b2ZpY2F0aW9uLXJlcGxhY2UnKS5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cf0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LU6INC30LDQvNC10L3QsCDQvdC1INCy0LjQtNC90LAnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINGB0LrRgNC+0LvQu9C40LxcbiAgICAgICAgc2Nyb2xsVG9SZXBsYWNlKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFjY2VwdFJlcGxhY2UoKSB7XG4gICAgICAgIHJlcGxhY2VzW2lSZXBsYWNlXS5pc0FjY2VwdCA9IHRydWU7XG4gICAgICAgIGdvVG9OZXh0UmVwbGFjZSgpO1xuICAgIH1cblxuICAgIHJlamVjdFJlcGxhY2UoKSB7XG4gICAgICAgIGdvVG9OZXh0UmVwbGFjZSgpO1xuICAgIH1cblxuICAgIHNob3dDdXJyZW50UmVwbGFjZUFnYWluKCkge1xuICAgICAgICBzY3JvbGxUb1JlcGxhY2UoKTtcbiAgICB9XG5cbiAgICBzY3JvbGxUb1JlcGxhY2UoKSB7XG4gICAgICAgIGxldCByZXBsYWNlID0gJCgnI3lvZmljYXRpb24tcmVwbGFjZScpO1xuICAgICAgICBpZiAocmVwbGFjZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICQuc2Nyb2xsVG8ocmVwbGFjZSwge292ZXI6IDAuNSwgb2Zmc2V0OiAtJCh3aW5kb3cpLmhlaWdodCgpIC8gMn0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3lvZmljYXRpb24uanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gZXhwb3J0IGNvbnN0IEJBQ0tFTkRfSE9TVCA9ICdodHRwczovL3lvZmljYXRpb24uZGlyYXJpYS5ydSc7XG5leHBvcnQgY29uc3QgQkFDS0VORF9IT1NUID0gJ2h0dHA6Ly9sb2NhbGhvc3QnO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NldHRpbmdzLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=
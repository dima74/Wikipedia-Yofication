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
/* harmony export (immutable) */ __webpack_exports__["a"] = assert;
/* harmony export (immutable) */ __webpack_exports__["b"] = fetchJson;
/* harmony export (immutable) */ __webpack_exports__["c"] = removeArgumentsFromUrl;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__toast__ = __webpack_require__(1);


function assert(expression, message = 'Непредвиденная ошибка') {
    if (!expression) {
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])(message);
        throw message;
    }
}

async function fetchJson(url, settings = {}) {
    let errorMessage = settings.errorMessage || 'todo';
    delete settings.errorMessage;

    try {
        let text = await $.ajax(url, settings);
        console.log(url);
        // console.log(url, text);
        return text;
    } catch (e) {
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])(errorMessage);
        throw e;
    }
}

// export async function fetchJson(url, settings) {
//     return JSON.parse(await fetchText(url, settings));
// }

function removeArgumentsFromUrl() {
    window.history.pushState('', '', window.location.href.replace('?yofication', ''));
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toast;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);


let toastInitialized = false;

function initToast() {
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
}

// todo убрать `error`
function toast(status, error = null) {
    if (!toastInitialized) {
        toastInitialized = true;
        initToast();
    }
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "main", function() { return main; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery_scrollto__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery_scrollto___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery_scrollto__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wikipedia_api__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__toast__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__backend__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__yofication__ = __webpack_require__(8);






const settings = {
    addPortletLinkAction: typeof Eficator_AddPortletLinkAction === 'undefined' ? true : Eficator_AddPortleteLinkAction,
    editSummary: typeof Eficator_EditSummary === 'undefined' ? 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]' : Eficator_EditSummary,
    minReplaceFrequency: typeof Eficator_MinReplaceFrequency === 'undefined' ? 60 : Eficator_MinReplaceFrequency
};

class Main {
    constructor() {
        this.wikipediaApi = new __WEBPACK_IMPORTED_MODULE_1__wikipedia_api__["b" /* default */]();
        this.backend = new __WEBPACK_IMPORTED_MODULE_3__backend__["a" /* default */]();
        this.settings = settings;
    }

    start() {
        if (__WEBPACK_IMPORTED_MODULE_1__wikipedia_api__["a" /* currentPageName */] === 'Служебная:Ёфикация') {
            this.performContinuousYofication();
        } else if (window.location.search.includes('yofication')) {
            let continuousYofication = window.location.search.includes('continuous_yofication');
            new __WEBPACK_IMPORTED_MODULE_4__yofication__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__wikipedia_api__["a" /* currentPageName */], continuousYofication).perform();
        } else if (settings.addPortletLinkAction && this.wikipediaApi.isMainNamespace()) {
            mw.util.addPortletLink('p-cactions', '/wiki/' + __WEBPACK_IMPORTED_MODULE_1__wikipedia_api__["a" /* currentPageName */] + '?yofication', 'Ёфицировать', 'ca-eficator', ' Ёфицировать страницу');
        }
    }

    async performContinuousYofication() {
        Object(__WEBPACK_IMPORTED_MODULE_2__toast__["a" /* default */])('Переходим к следующей странице: \nЗагружаем название статьи для ёфикации...');
        let pageName = await this.backend.getRandomPageName();
        window.location.href = 'https://ru.wikipedia.org/wiki/' + pageName + '?continuous_yofication';
    }
}

let main = new Main();
main.start();

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);


class WikipediaApi {
    // with namespace, with underscores, without spaces
    // getPageNameFull() {
    //     return mw.config.get('wgPageName');
    // }

    // without namespace, without underscores, with spaces
    // getPageName() {
    //     return mw.config.get('wgTitle');
    // }

    isMainNamespace() {
        return mw.config.get('wgNamespaceNumber') === 0;
    }

    async getWikitext(title) {
        let data = {
            action: 'query',
            prop: 'revisions',
            titles: title,
            rvprop: 'content',
            format: 'json'
        };
        let response = await Object(__WEBPACK_IMPORTED_MODULE_0__base__["b" /* fetchJson */])(`/w/api.php`, {data});
        return Object.values(response.query.pages)[0].revisions[0]['*'];
    }

    getEditToken() {
        return mw.user.tokens.get('editToken');
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = WikipediaApi;


// with namespace, with underscores, without spaces
const currentPageName = mw.config.get('wgPageName');
/* harmony export (immutable) */ __webpack_exports__["a"] = currentPageName;


/***/ }),
/* 4 */
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
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
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
/* 5 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings__ = __webpack_require__(7);



class Backend {
    async getRandomPageName() {
        let errorMessage = 'Не удалось получить следующую страницу для ёфикации';
        return await Object(__WEBPACK_IMPORTED_MODULE_0__base__["b" /* fetchJson */])(__WEBPACK_IMPORTED_MODULE_1__settings__["a" /* BACKEND_HOST */] + '/randomPageName', {errorMessage});
    }

    async getReplaces(pageName) {
        let errorMessage = 'Произошла ошибка при загрузке списка замен';
        return await Object(__WEBPACK_IMPORTED_MODULE_0__base__["b" /* fetchJson */])(__WEBPACK_IMPORTED_MODULE_1__settings__["a" /* BACKEND_HOST */] + '/replaces/' + pageName, {errorMessage});
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__toast__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__main__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__wikipedia_api__ = __webpack_require__(3);





String.prototype.insert = function (i, s, numberCharsToReplace) {
    return this.substr(0, i) + s + this.substr(i + numberCharsToReplace);
};

String.prototype.getIndexesOf = function (s) {
    let indexes = [];
    let start = 0;
    let position;
    while ((position = this.indexOf(s, start)) !== -1) {
        indexes.push(position);
        start = position + s.length;
    }
    return indexes;
};

String.prototype.deyofication = function () {
    return this.replace('ё', 'е');
};

String.prototype.isRussianLetterInWord = function () {
    return this.length === 1 && this.match(/[а-яА-ЯёЁ\-\u00AD\u0301]/);
};

class Yofication {
    constructor(continuousYofication) {
        this.continuousYofication = continuousYofication;
        this.textDiv = $('#mw-content-text');
        this.text = this.textDiv.html();
        this.iReplace = -1;
        this.done = false;
        this.wikitext = __WEBPACK_IMPORTED_MODULE_2__main__["main"].wikipediaApi.getWikitext(__WEBPACK_IMPORTED_MODULE_3__wikipedia_api__["a" /* currentPageName */]);
    }

    async perform() {
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Загружаем список замен...');
        let {replaces, revision} = await __WEBPACK_IMPORTED_MODULE_2__main__["main"].backend.getReplaces(__WEBPACK_IMPORTED_MODULE_3__wikipedia_api__["a" /* currentPageName */]);
        this.replaces = replaces;

        let revisionLocal = mw.config.get('wgCurRevisionId');
        if (revision !== revisionLocal) {
            throw `revision doesn't match\n local: ${revisionLocal} \nremote: ${revision}`;
        }

        replaces = replaces.filter(replace => replace.frequency >= __WEBPACK_IMPORTED_MODULE_2__main__["main"].settings.minReplaceFrequency);
        if (replaces.length === 0) {
            Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)');
            Object(__WEBPACK_IMPORTED_MODULE_1__base__["c" /* removeArgumentsFromUrl */])();
            return;
        }
        replaces.forEach(replace => replace.isAccept = false);

        this.goToNextReplace();
        $(window).on('resize', this.scrollToReplace);
        this.initializeActions();
    }

    initializeActions() {
        let actionsArray = [
            [this.acceptReplace, 'j', 'о'],
            [this.rejectReplace, 'f', 'а'],
            // ещё раз показать последнюю замену
            [this.showCurrentReplaceAgain, ';', 'ж'],
            // вернуться к предыдущей замене
            [this.goToPreviousReplace, 'a', 'ф']
        ];

        let actions = {};
        for (let action of actionsArray) {
            let actionFunction = action[0];
            let keys = action.slice(1);
            for (let key of keys) {
                actions[key] = actionFunction;
            }
        }

        $(document).keypress((event) => {
                if (!this.done && event.key in actions) {
                    actions[event.key]();
                }
            }
        );
    }

    goToNextReplace() {
        while (!this.goToReplace(++this.iReplace)) {}
    }

    goToPreviousReplace() {
        --this.iReplace;
        while (this.iReplace >= 0 && !this.goToReplace(this.iReplace)) {
            --this.iReplace;
        }
        if (this.iReplace < 0) {
            this.iReplace = 0;
            throw 'goToPreviousReplace: iReplace < 0';
        }
        this.replaces[this.iReplace].isAccept = false;
    }

    goToReplace(iReplace) {
        if (this.iReplace === this.replaces.length) {
            this.textDiv.html(text);
            this.makeChange(this.continuousYofication ? this.goToNextPage : __WEBPACK_IMPORTED_MODULE_1__base__["c" /* removeArgumentsFromUrl */]);
            return true;
        }
        if (this.iReplace > this.replaces.length) {
            throw 'goToReplace: iReplace > replaces.length';
        }

        let replace = this.replaces[iReplace];
        let yoword = replace.yoword;
        let status = 'Замена ' + (this.iReplace + 1) + ' из ' + this.replaces.length + '\n' + yoword + '\nЧастота: ' + replace.frequency + '%';
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])(status);
        let indexes = this.text.getIndexesOf(yoword.deyofication());

        // игнорируем вхождения dword внутри слов
        indexes = indexes.filter(i => {
                let j = i + yoword.length;
                return (i === 0 || !this.text[i - 1].isRussianLetterInWord()) && (j === this.text.length || !this.text[j].isRussianLetterInWord());
            }
        );

        // выделяем цветом
        if (indexes.length !== replace.numberSameDwords) {
            Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])(status + '\nПредупреждение: не совпадает numberSameDwords\nНайдено: ' + indexes.length + '\nДолжно быть: ' + replace.numberSameDwords + ' \n(индексы найденных: ' + indexes + ')');
            return false;
        }
        let wordIndexStart = indexes[replace.numberSameDwordsBefore];
        let textNew = this.text.insert(wordIndexStart, '<span style="background: cyan;" id="yofication-replace">' + yoword + '</span>', yoword.length);
        this.textDiv.html(textNew);

        // проверяем на видимость
        if (!$('#yofication-replace').is(':visible')) {
            console.log('Предупреждение: замена не видна');
            return false;
        }

        // скроллим
        this.scrollToReplace();
        return true;
    }

    acceptReplace() {
        this.replaces[iReplace].isAccept = true;
        this.goToNextReplace();
    }

    rejectReplace() {
        this.goToNextReplace();
    }

    showCurrentReplaceAgain() {
        this.scrollToReplace();
    }

    scrollToReplace() {
        let replace = $('#yofication-replace');
        if (replace.length) {
            $.scrollTo(replace, {over: 0.5, offset: -$(window).height() / 2});
        }
    }

    async makeChange() {
        this.done = true;
        let replacesRight = this.replaces.filter(replace => replace.isAccept);
        if (replacesRight.length === 0) {
            Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])();
            return;
        }

        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Делаем правку: \nЗагружаем викитекст страницы...');
        let wikitext = await this.wikitext;
        Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Делаем правку: \nПрименяем замены...');
        let replaceSomething = false;
        for (let i = 0; i < replacesRight.length; ++i) {
            let replace = replacesRight[i];
            let yoword = replace.yoword;
            if (wikitext.substr(replace.wordIndexStart, yoword.length) !== yoword.deyofication()) {
                exit('Ошибка: викитекст страницы "' + __WEBPACK_IMPORTED_MODULE_3__wikipedia_api__["a" /* currentPageName */] + '" не совпадает в индексе ' + replace.wordIndexStart
                    + '\nПожалуйста, сообщите название этой страницы [[Участник:Дима74|автору скрипта]].'
                    + '\nожидается: "' + yoword.deyofication() + '"'
                    + '\nполучено: "' + wikitext.substr(replace.wordIndexStart, yoword.length) + '"', false);
                return;
            }
            wikitext = wikitext.insert(replace.wordIndexStart, yoword, yoword.length);
            replaceSomething = true;
        }

        if (replaceSomething) {
            Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Делаем правку: \nОтправляем изменения...');
            let response = await Object(__WEBPACK_IMPORTED_MODULE_1__base__["b" /* fetchJson */])('/w/api.php', {
                errorMessage: 'Не удалось произвести правку',
                type: 'POST',
                data: {
                    format: 'json',
                    action: 'edit',
                    title: __WEBPACK_IMPORTED_MODULE_3__wikipedia_api__["a" /* currentPageName */],
                    minor: true,
                    text: wikitext,
                    summary: __WEBPACK_IMPORTED_MODULE_2__main__["main"].settings.editSummary,
                    token: mw.user.tokens.get('editToken')
                }
            });
            if (!response.edit || response.edit.result !== 'Success') {
                console.log(response);
                Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Не удалось произвести правку: ' + (data.edit ? data.edit.info : 'неизвестная ошибка'));
                return;
            }
            Object(__WEBPACK_IMPORTED_MODULE_0__toast__["a" /* default */])('Правка выполена');
        }
    }

    goToNextPage() {
        __WEBPACK_IMPORTED_MODULE_2__main__["main"].performContinuousYofication();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Yofication;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWI5NWY2MmViZWUyOTFhNjBiY2EiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RvYXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy93aWtpcGVkaWEtYXBpLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcXVlcnkuc2Nyb2xsdG8vanF1ZXJ5LnNjcm9sbFRvLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImpRdWVyeVwiIiwid2VicGFjazovLy8uL3NyYy9iYWNrZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMveW9maWNhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkNBQWtEO0FBQ2xEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEM7Ozs7Ozs7OztBQzlCZTs7QUFF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QTtBQUNBO0FBQ0EsdUJBQXVCLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEMiLCJmaWxlIjoieW9maWNhdG9yLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDViOTVmNjJlYmVlMjkxYTYwYmNhIiwiaW1wb3J0IHRvYXN0IGZyb20gJy4vdG9hc3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0KGV4cHJlc3Npb24sIG1lc3NhZ2UgPSAn0J3QtdC/0YDQtdC00LLQuNC00LXQvdC90LDRjyDQvtGI0LjQsdC60LAnKSB7XG4gICAgaWYgKCFleHByZXNzaW9uKSB7XG4gICAgICAgIHRvYXN0KG1lc3NhZ2UpO1xuICAgICAgICB0aHJvdyBtZXNzYWdlO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoSnNvbih1cmwsIHNldHRpbmdzID0ge30pIHtcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gc2V0dGluZ3MuZXJyb3JNZXNzYWdlIHx8ICd0b2RvJztcbiAgICBkZWxldGUgc2V0dGluZ3MuZXJyb3JNZXNzYWdlO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IHRleHQgPSBhd2FpdCAkLmFqYXgodXJsLCBzZXR0aW5ncyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHVybCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHVybCwgdGV4dCk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdG9hc3QoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG59XG5cbi8vIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEpzb24odXJsLCBzZXR0aW5ncykge1xuLy8gICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IGZldGNoVGV4dCh1cmwsIHNldHRpbmdzKSk7XG4vLyB9XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVBcmd1bWVudHNGcm9tVXJsKCkge1xuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoJz95b2ZpY2F0aW9uJywgJycpKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7YXNzZXJ0fSBmcm9tICcuL2Jhc2UnO1xuXG5sZXQgdG9hc3RJbml0aWFsaXplZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBpbml0VG9hc3QoKSB7XG4gICAgY29uc3QgU05BQ0tCQVJfSFRNTCA9IGBcbiAgICA8ZGl2IFxuICAgICAgICBpZD1cInlvZmljYXRvci1zbmFja2JhclwiIFxuICAgICAgICBzdHlsZT1cIlxuICAgICAgICAgICAgbWluLXdpZHRoOiAyNTBweDsgXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7IFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzMzMzsgXG4gICAgICAgICAgICBjb2xvcjogI2ZmZjsgXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IFxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4OyBcbiAgICAgICAgICAgIHBhZGRpbmc6IDE2cHg7IFxuICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkOyBcbiAgICAgICAgICAgIHotaW5kZXg6IDE7IFxuICAgICAgICAgICAgbGVmdDogNTAlOyBcbiAgICAgICAgICAgIGJvdHRvbTogMzBweDtcIlxuICAgID7QodC/0LDRgdC40LHQviwg0YfRgtC+INCy0L7RgdC/0L7Qu9GM0LfQvtCy0LDQu9C40YHRjCDRkdGE0LjQutCw0YLQvtGA0L7QvCE8L2Rpdj5gO1xuICAgICQoJ2JvZHknKS5hcHBlbmQoU05BQ0tCQVJfSFRNTCk7XG59XG5cbi8vIHRvZG8g0YPQsdGA0LDRgtGMIGBlcnJvcmBcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvYXN0KHN0YXR1cywgZXJyb3IgPSBudWxsKSB7XG4gICAgaWYgKCF0b2FzdEluaXRpYWxpemVkKSB7XG4gICAgICAgIHRvYXN0SW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICBpbml0VG9hc3QoKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coc3RhdHVzKTtcbiAgICBsZXQgc25hY2tiYXIgPSAkKCcjeW9maWNhdG9yLXNuYWNrYmFyJyk7XG4gICAgYXNzZXJ0KHNuYWNrYmFyLmxlbmd0aCA9PT0gMSk7XG4gICAgaWYgKGVycm9yICE9PSBudWxsKSB7XG4gICAgICAgIHN0YXR1cyArPSAnXFxu0J/QvtC20LDQu9GD0LnRgdGC0LAsINC/0L7Qv9GA0L7QsdGD0LnRgtC1INC+0LHQvdC+0LLQuNGC0Ywg0YHRgtGA0LDQvdC40YbRgy4gXFxu0JXRgdC70Lgg0Y3RgtC+INC90LUg0L/QvtC80L7QttC10YIsINGB0LLRj9C20LjRgtC10YHRjCDRgSBbW9Cj0YfQsNGB0YLQvdC40Lo60JTQuNC80LA3NHzQsNCy0YLQvtGA0L7QvCDRgdC60YDQuNC/0YLQsF1dLic7XG4gICAgfVxuXG4gICAgc3RhdHVzID0gc3RhdHVzLnJlcGxhY2UoL1xcbi9nLCAnPGJyIC8+Jyk7XG4gICAgLy8gW1vRgdGB0YvQu9C60LB80LjQvNGPXV0gLT4gPGEgaHJlZj1cIi93aWtpL9GB0YHRi9C70LrQsFwiPtC40LzRjzwvYT5cbiAgICBzdGF0dXMgPSBzdGF0dXMucmVwbGFjZSgvXFxbXFxbKFtefF0qKVxcfChbXlxcXV0qKV1dL2csICc8YSBocmVmPVwiL3dpa2kvJDFcIiBzdHlsZT1cImNvbG9yOiAjMGZmO1wiPiQyPC9hPicpO1xuICAgIHNuYWNrYmFyLmh0bWwoc3RhdHVzKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90b2FzdC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgJ2pxdWVyeS5zY3JvbGx0byc7XG5pbXBvcnQgV2lraXBlZGlhQXBpLCB7Y3VycmVudFBhZ2VOYW1lfSBmcm9tICcuL3dpa2lwZWRpYS1hcGknO1xuaW1wb3J0IHRvYXN0IGZyb20gJy4vdG9hc3QnO1xuaW1wb3J0IEJhY2tlbmQgZnJvbSAnLi9iYWNrZW5kJztcbmltcG9ydCBZb2ZpY2F0aW9uIGZyb20gJy4veW9maWNhdGlvbic7XG5cbmNvbnN0IHNldHRpbmdzID0ge1xuICAgIGFkZFBvcnRsZXRMaW5rQWN0aW9uOiB0eXBlb2YgRWZpY2F0b3JfQWRkUG9ydGxldExpbmtBY3Rpb24gPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IEVmaWNhdG9yX0FkZFBvcnRsZXRlTGlua0FjdGlvbixcbiAgICBlZGl0U3VtbWFyeTogdHlwZW9mIEVmaWNhdG9yX0VkaXRTdW1tYXJ5ID09PSAndW5kZWZpbmVkJyA/ICfQgdGE0LjQutCw0YbQuNGPINGBINC/0L7QvNC+0YnRjNGOIFtb0KPRh9Cw0YHRgtC90LjQujrQlNC40LzQsDc0L9Ch0LrRgNC40L/Rgi3QgdGE0LjQutCw0YLQvtGAfNGB0LrRgNC40L/RgtCwLdGR0YTQuNC60LDRgtC+0YDQsF1dJyA6IEVmaWNhdG9yX0VkaXRTdW1tYXJ5LFxuICAgIG1pblJlcGxhY2VGcmVxdWVuY3k6IHR5cGVvZiBFZmljYXRvcl9NaW5SZXBsYWNlRnJlcXVlbmN5ID09PSAndW5kZWZpbmVkJyA/IDYwIDogRWZpY2F0b3JfTWluUmVwbGFjZUZyZXF1ZW5jeVxufTtcblxuY2xhc3MgTWFpbiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMud2lraXBlZGlhQXBpID0gbmV3IFdpa2lwZWRpYUFwaSgpO1xuICAgICAgICB0aGlzLmJhY2tlbmQgPSBuZXcgQmFja2VuZCgpO1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmIChjdXJyZW50UGFnZU5hbWUgPT09ICfQodC70YPQttC10LHQvdCw0Y860IHRhNC40LrQsNGG0LjRjycpIHtcbiAgICAgICAgICAgIHRoaXMucGVyZm9ybUNvbnRpbnVvdXNZb2ZpY2F0aW9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaC5pbmNsdWRlcygneW9maWNhdGlvbicpKSB7XG4gICAgICAgICAgICBsZXQgY29udGludW91c1lvZmljYXRpb24gPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLmluY2x1ZGVzKCdjb250aW51b3VzX3lvZmljYXRpb24nKTtcbiAgICAgICAgICAgIG5ldyBZb2ZpY2F0aW9uKGN1cnJlbnRQYWdlTmFtZSwgY29udGludW91c1lvZmljYXRpb24pLnBlcmZvcm0oKTtcbiAgICAgICAgfSBlbHNlIGlmIChzZXR0aW5ncy5hZGRQb3J0bGV0TGlua0FjdGlvbiAmJiB0aGlzLndpa2lwZWRpYUFwaS5pc01haW5OYW1lc3BhY2UoKSkge1xuICAgICAgICAgICAgbXcudXRpbC5hZGRQb3J0bGV0TGluaygncC1jYWN0aW9ucycsICcvd2lraS8nICsgY3VycmVudFBhZ2VOYW1lICsgJz95b2ZpY2F0aW9uJywgJ9CB0YTQuNGG0LjRgNC+0LLQsNGC0YwnLCAnY2EtZWZpY2F0b3InLCAnINCB0YTQuNGG0LjRgNC+0LLQsNGC0Ywg0YHRgtGA0LDQvdC40YbRgycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgcGVyZm9ybUNvbnRpbnVvdXNZb2ZpY2F0aW9uKCkge1xuICAgICAgICB0b2FzdCgn0J/QtdGA0LXRhdC+0LTQuNC8INC6INGB0LvQtdC00YPRjtGJ0LXQuSDRgdGC0YDQsNC90LjRhtC1OiBcXG7Ql9Cw0LPRgNGD0LbQsNC10Lwg0L3QsNC30LLQsNC90LjQtSDRgdGC0LDRgtGM0Lgg0LTQu9GPINGR0YTQuNC60LDRhtC40LguLi4nKTtcbiAgICAgICAgbGV0IHBhZ2VOYW1lID0gYXdhaXQgdGhpcy5iYWNrZW5kLmdldFJhbmRvbVBhZ2VOYW1lKCk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2h0dHBzOi8vcnUud2lraXBlZGlhLm9yZy93aWtpLycgKyBwYWdlTmFtZSArICc/Y29udGludW91c195b2ZpY2F0aW9uJztcbiAgICB9XG59XG5cbmV4cG9ydCBsZXQgbWFpbiA9IG5ldyBNYWluKCk7XG5tYWluLnN0YXJ0KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge2ZldGNoSnNvbn0gZnJvbSBcIi4vYmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaWtpcGVkaWFBcGkge1xuICAgIC8vIHdpdGggbmFtZXNwYWNlLCB3aXRoIHVuZGVyc2NvcmVzLCB3aXRob3V0IHNwYWNlc1xuICAgIC8vIGdldFBhZ2VOYW1lRnVsbCgpIHtcbiAgICAvLyAgICAgcmV0dXJuIG13LmNvbmZpZy5nZXQoJ3dnUGFnZU5hbWUnKTtcbiAgICAvLyB9XG5cbiAgICAvLyB3aXRob3V0IG5hbWVzcGFjZSwgd2l0aG91dCB1bmRlcnNjb3Jlcywgd2l0aCBzcGFjZXNcbiAgICAvLyBnZXRQYWdlTmFtZSgpIHtcbiAgICAvLyAgICAgcmV0dXJuIG13LmNvbmZpZy5nZXQoJ3dnVGl0bGUnKTtcbiAgICAvLyB9XG5cbiAgICBpc01haW5OYW1lc3BhY2UoKSB7XG4gICAgICAgIHJldHVybiBtdy5jb25maWcuZ2V0KCd3Z05hbWVzcGFjZU51bWJlcicpID09PSAwO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFdpa2l0ZXh0KHRpdGxlKSB7XG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgYWN0aW9uOiAncXVlcnknLFxuICAgICAgICAgICAgcHJvcDogJ3JldmlzaW9ucycsXG4gICAgICAgICAgICB0aXRsZXM6IHRpdGxlLFxuICAgICAgICAgICAgcnZwcm9wOiAnY29udGVudCcsXG4gICAgICAgICAgICBmb3JtYXQ6ICdqc29uJ1xuICAgICAgICB9O1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaEpzb24oYC93L2FwaS5waHBgLCB7ZGF0YX0pO1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhyZXNwb25zZS5xdWVyeS5wYWdlcylbMF0ucmV2aXNpb25zWzBdWycqJ107XG4gICAgfVxuXG4gICAgZ2V0RWRpdFRva2VuKCkge1xuICAgICAgICByZXR1cm4gbXcudXNlci50b2tlbnMuZ2V0KCdlZGl0VG9rZW4nKTtcbiAgICB9XG59XG5cbi8vIHdpdGggbmFtZXNwYWNlLCB3aXRoIHVuZGVyc2NvcmVzLCB3aXRob3V0IHNwYWNlc1xuZXhwb3J0IGNvbnN0IGN1cnJlbnRQYWdlTmFtZSA9IG13LmNvbmZpZy5nZXQoJ3dnUGFnZU5hbWUnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy93aWtpcGVkaWEtYXBpLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogalF1ZXJ5LnNjcm9sbFRvXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDctMjAxNSBBcmllbCBGbGVzbGVyIC0gYWZsZXNsZXI8YT5nbWFpbDxkPmNvbSB8IGh0dHA6Ly9mbGVzbGVyLmJsb2dzcG90LmNvbVxuICogTGljZW5zZWQgdW5kZXIgTUlUXG4gKiBodHRwOi8vZmxlc2xlci5ibG9nc3BvdC5jb20vMjAwNy8xMC9qcXVlcnlzY3JvbGx0by5odG1sXG4gKiBAcHJvamVjdERlc2NyaXB0aW9uIExpZ2h0d2VpZ2h0LCBjcm9zcy1icm93c2VyIGFuZCBoaWdobHkgY3VzdG9taXphYmxlIGFuaW1hdGVkIHNjcm9sbGluZyB3aXRoIGpRdWVyeVxuICogQGF1dGhvciBBcmllbCBGbGVzbGVyXG4gKiBAdmVyc2lvbiAyLjEuMlxuICovXG47KGZ1bmN0aW9uKGZhY3RvcnkpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gQU1EXG5cdFx0ZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0Ly8gQ29tbW9uSlNcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIEdsb2JhbFxuXHRcdGZhY3RvcnkoalF1ZXJ5KTtcblx0fVxufSkoZnVuY3Rpb24oJCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyICRzY3JvbGxUbyA9ICQuc2Nyb2xsVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCBzZXR0aW5ncykge1xuXHRcdHJldHVybiAkKHdpbmRvdykuc2Nyb2xsVG8odGFyZ2V0LCBkdXJhdGlvbiwgc2V0dGluZ3MpO1xuXHR9O1xuXG5cdCRzY3JvbGxUby5kZWZhdWx0cyA9IHtcblx0XHRheGlzOid4eScsXG5cdFx0ZHVyYXRpb246IDAsXG5cdFx0bGltaXQ6dHJ1ZVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGlzV2luKGVsZW0pIHtcblx0XHRyZXR1cm4gIWVsZW0ubm9kZU5hbWUgfHxcblx0XHRcdCQuaW5BcnJheShlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksIFsnaWZyYW1lJywnI2RvY3VtZW50JywnaHRtbCcsJ2JvZHknXSkgIT09IC0xO1xuXHR9XHRcdFxuXG5cdCQuZm4uc2Nyb2xsVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCBzZXR0aW5ncykge1xuXHRcdGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRzZXR0aW5ncyA9IGR1cmF0aW9uO1xuXHRcdFx0ZHVyYXRpb24gPSAwO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHNldHRpbmdzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRzZXR0aW5ncyA9IHsgb25BZnRlcjpzZXR0aW5ncyB9O1xuXHRcdH1cblx0XHRpZiAodGFyZ2V0ID09PSAnbWF4Jykge1xuXHRcdFx0dGFyZ2V0ID0gOWU5O1xuXHRcdH1cblxuXHRcdHNldHRpbmdzID0gJC5leHRlbmQoe30sICRzY3JvbGxUby5kZWZhdWx0cywgc2V0dGluZ3MpO1xuXHRcdC8vIFNwZWVkIGlzIHN0aWxsIHJlY29nbml6ZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5cdFx0ZHVyYXRpb24gPSBkdXJhdGlvbiB8fCBzZXR0aW5ncy5kdXJhdGlvbjtcblx0XHQvLyBNYWtlIHN1cmUgdGhlIHNldHRpbmdzIGFyZSBnaXZlbiByaWdodFxuXHRcdHZhciBxdWV1ZSA9IHNldHRpbmdzLnF1ZXVlICYmIHNldHRpbmdzLmF4aXMubGVuZ3RoID4gMTtcblx0XHRpZiAocXVldWUpIHtcblx0XHRcdC8vIExldCdzIGtlZXAgdGhlIG92ZXJhbGwgZHVyYXRpb25cblx0XHRcdGR1cmF0aW9uIC89IDI7XG5cdFx0fVxuXHRcdHNldHRpbmdzLm9mZnNldCA9IGJvdGgoc2V0dGluZ3Mub2Zmc2V0KTtcblx0XHRzZXR0aW5ncy5vdmVyID0gYm90aChzZXR0aW5ncy5vdmVyKTtcblxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBOdWxsIHRhcmdldCB5aWVsZHMgbm90aGluZywganVzdCBsaWtlIGpRdWVyeSBkb2VzXG5cdFx0XHRpZiAodGFyZ2V0ID09PSBudWxsKSByZXR1cm47XG5cblx0XHRcdHZhciB3aW4gPSBpc1dpbih0aGlzKSxcblx0XHRcdFx0ZWxlbSA9IHdpbiA/IHRoaXMuY29udGVudFdpbmRvdyB8fCB3aW5kb3cgOiB0aGlzLFxuXHRcdFx0XHQkZWxlbSA9ICQoZWxlbSksXG5cdFx0XHRcdHRhcmcgPSB0YXJnZXQsIFxuXHRcdFx0XHRhdHRyID0ge30sXG5cdFx0XHRcdHRvZmY7XG5cblx0XHRcdHN3aXRjaCAodHlwZW9mIHRhcmcpIHtcblx0XHRcdFx0Ly8gQSBudW1iZXIgd2lsbCBwYXNzIHRoZSByZWdleFxuXHRcdFx0XHRjYXNlICdudW1iZXInOlxuXHRcdFx0XHRjYXNlICdzdHJpbmcnOlxuXHRcdFx0XHRcdGlmICgvXihbKy1dPT8pP1xcZCsoXFwuXFxkKyk/KHB4fCUpPyQvLnRlc3QodGFyZykpIHtcblx0XHRcdFx0XHRcdHRhcmcgPSBib3RoKHRhcmcpO1xuXHRcdFx0XHRcdFx0Ly8gV2UgYXJlIGRvbmVcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBSZWxhdGl2ZS9BYnNvbHV0ZSBzZWxlY3RvclxuXHRcdFx0XHRcdHRhcmcgPSB3aW4gPyAkKHRhcmcpIDogJCh0YXJnLCBlbGVtKTtcblx0XHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRcdGNhc2UgJ29iamVjdCc6XG5cdFx0XHRcdFx0aWYgKHRhcmcubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdFx0XHRcdFx0Ly8gRE9NRWxlbWVudCAvIGpRdWVyeVxuXHRcdFx0XHRcdGlmICh0YXJnLmlzIHx8IHRhcmcuc3R5bGUpIHtcblx0XHRcdFx0XHRcdC8vIEdldCB0aGUgcmVhbCBwb3NpdGlvbiBvZiB0aGUgdGFyZ2V0XG5cdFx0XHRcdFx0XHR0b2ZmID0gKHRhcmcgPSAkKHRhcmcpKS5vZmZzZXQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBvZmZzZXQgPSAkLmlzRnVuY3Rpb24oc2V0dGluZ3Mub2Zmc2V0KSAmJiBzZXR0aW5ncy5vZmZzZXQoZWxlbSwgdGFyZykgfHwgc2V0dGluZ3Mub2Zmc2V0O1xuXG5cdFx0XHQkLmVhY2goc2V0dGluZ3MuYXhpcy5zcGxpdCgnJyksIGZ1bmN0aW9uKGksIGF4aXMpIHtcblx0XHRcdFx0dmFyIFBvc1x0PSBheGlzID09PSAneCcgPyAnTGVmdCcgOiAnVG9wJyxcblx0XHRcdFx0XHRwb3MgPSBQb3MudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRrZXkgPSAnc2Nyb2xsJyArIFBvcyxcblx0XHRcdFx0XHRwcmV2ID0gJGVsZW1ba2V5XSgpLFxuXHRcdFx0XHRcdG1heCA9ICRzY3JvbGxUby5tYXgoZWxlbSwgYXhpcyk7XG5cblx0XHRcdFx0aWYgKHRvZmYpIHsvLyBqUXVlcnkgLyBET01FbGVtZW50XG5cdFx0XHRcdFx0YXR0cltrZXldID0gdG9mZltwb3NdICsgKHdpbiA/IDAgOiBwcmV2IC0gJGVsZW0ub2Zmc2V0KClbcG9zXSk7XG5cblx0XHRcdFx0XHQvLyBJZiBpdCdzIGEgZG9tIGVsZW1lbnQsIHJlZHVjZSB0aGUgbWFyZ2luXG5cdFx0XHRcdFx0aWYgKHNldHRpbmdzLm1hcmdpbikge1xuXHRcdFx0XHRcdFx0YXR0cltrZXldIC09IHBhcnNlSW50KHRhcmcuY3NzKCdtYXJnaW4nK1BvcyksIDEwKSB8fCAwO1xuXHRcdFx0XHRcdFx0YXR0cltrZXldIC09IHBhcnNlSW50KHRhcmcuY3NzKCdib3JkZXInK1BvcysnV2lkdGgnKSwgMTApIHx8IDA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YXR0cltrZXldICs9IG9mZnNldFtwb3NdIHx8IDA7XG5cblx0XHRcdFx0XHRpZiAoc2V0dGluZ3Mub3Zlcltwb3NdKSB7XG5cdFx0XHRcdFx0XHQvLyBTY3JvbGwgdG8gYSBmcmFjdGlvbiBvZiBpdHMgd2lkdGgvaGVpZ2h0XG5cdFx0XHRcdFx0XHRhdHRyW2tleV0gKz0gdGFyZ1theGlzID09PSAneCc/J3dpZHRoJzonaGVpZ2h0J10oKSAqIHNldHRpbmdzLm92ZXJbcG9zXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHZhbCA9IHRhcmdbcG9zXTtcblx0XHRcdFx0XHQvLyBIYW5kbGUgcGVyY2VudGFnZSB2YWx1ZXNcblx0XHRcdFx0XHRhdHRyW2tleV0gPSB2YWwuc2xpY2UgJiYgdmFsLnNsaWNlKC0xKSA9PT0gJyUnID9cblx0XHRcdFx0XHRcdHBhcnNlRmxvYXQodmFsKSAvIDEwMCAqIG1heFxuXHRcdFx0XHRcdFx0OiB2YWw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBOdW1iZXIgb3IgJ251bWJlcidcblx0XHRcdFx0aWYgKHNldHRpbmdzLmxpbWl0ICYmIC9eXFxkKyQvLnRlc3QoYXR0cltrZXldKSkge1xuXHRcdFx0XHRcdC8vIENoZWNrIHRoZSBsaW1pdHNcblx0XHRcdFx0XHRhdHRyW2tleV0gPSBhdHRyW2tleV0gPD0gMCA/IDAgOiBNYXRoLm1pbihhdHRyW2tleV0sIG1heCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEb24ndCB3YXN0ZSB0aW1lIGFuaW1hdGluZywgaWYgdGhlcmUncyBubyBuZWVkLlxuXHRcdFx0XHRpZiAoIWkgJiYgc2V0dGluZ3MuYXhpcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0aWYgKHByZXYgPT09IGF0dHJba2V5XSkge1xuXHRcdFx0XHRcdFx0Ly8gTm8gYW5pbWF0aW9uIG5lZWRlZFxuXHRcdFx0XHRcdFx0YXR0ciA9IHt9O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocXVldWUpIHtcblx0XHRcdFx0XHRcdC8vIEludGVybWVkaWF0ZSBhbmltYXRpb25cblx0XHRcdFx0XHRcdGFuaW1hdGUoc2V0dGluZ3Mub25BZnRlckZpcnN0KTtcblx0XHRcdFx0XHRcdC8vIERvbid0IGFuaW1hdGUgdGhpcyBheGlzIGFnYWluIGluIHRoZSBuZXh0IGl0ZXJhdGlvbi5cblx0XHRcdFx0XHRcdGF0dHIgPSB7fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRhbmltYXRlKHNldHRpbmdzLm9uQWZ0ZXIpO1xuXG5cdFx0XHRmdW5jdGlvbiBhbmltYXRlKGNhbGxiYWNrKSB7XG5cdFx0XHRcdHZhciBvcHRzID0gJC5leHRlbmQoe30sIHNldHRpbmdzLCB7XG5cdFx0XHRcdFx0Ly8gVGhlIHF1ZXVlIHNldHRpbmcgY29uZmxpY3RzIHdpdGggYW5pbWF0ZSgpXG5cdFx0XHRcdFx0Ly8gRm9yY2UgaXQgdG8gYWx3YXlzIGJlIHRydWVcblx0XHRcdFx0XHRxdWV1ZTogdHJ1ZSxcblx0XHRcdFx0XHRkdXJhdGlvbjogZHVyYXRpb24sXG5cdFx0XHRcdFx0Y29tcGxldGU6IGNhbGxiYWNrICYmIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChlbGVtLCB0YXJnLCBzZXR0aW5ncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0JGVsZW0uYW5pbWF0ZShhdHRyLCBvcHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHQvLyBNYXggc2Nyb2xsaW5nIHBvc2l0aW9uLCB3b3JrcyBvbiBxdWlya3MgbW9kZVxuXHQvLyBJdCBvbmx5IGZhaWxzIChub3QgdG9vIGJhZGx5KSBvbiBJRSwgcXVpcmtzIG1vZGUuXG5cdCRzY3JvbGxUby5tYXggPSBmdW5jdGlvbihlbGVtLCBheGlzKSB7XG5cdFx0dmFyIERpbSA9IGF4aXMgPT09ICd4JyA/ICdXaWR0aCcgOiAnSGVpZ2h0Jyxcblx0XHRcdHNjcm9sbCA9ICdzY3JvbGwnK0RpbTtcblxuXHRcdGlmICghaXNXaW4oZWxlbSkpXG5cdFx0XHRyZXR1cm4gZWxlbVtzY3JvbGxdIC0gJChlbGVtKVtEaW0udG9Mb3dlckNhc2UoKV0oKTtcblxuXHRcdHZhciBzaXplID0gJ2NsaWVudCcgKyBEaW0sXG5cdFx0XHRkb2MgPSBlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbS5kb2N1bWVudCxcblx0XHRcdGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50LFxuXHRcdFx0Ym9keSA9IGRvYy5ib2R5O1xuXG5cdFx0cmV0dXJuIE1hdGgubWF4KGh0bWxbc2Nyb2xsXSwgYm9keVtzY3JvbGxdKSAtIE1hdGgubWluKGh0bWxbc2l6ZV0sIGJvZHlbc2l6ZV0pO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGJvdGgodmFsKSB7XG5cdFx0cmV0dXJuICQuaXNGdW5jdGlvbih2YWwpIHx8ICQuaXNQbGFpbk9iamVjdCh2YWwpID8gdmFsIDogeyB0b3A6dmFsLCBsZWZ0OnZhbCB9O1xuXHR9XG5cblx0Ly8gQWRkIHNwZWNpYWwgaG9va3Mgc28gdGhhdCB3aW5kb3cgc2Nyb2xsIHByb3BlcnRpZXMgY2FuIGJlIGFuaW1hdGVkXG5cdCQuVHdlZW4ucHJvcEhvb2tzLnNjcm9sbExlZnQgPSBcblx0JC5Ud2Vlbi5wcm9wSG9va3Muc2Nyb2xsVG9wID0ge1xuXHRcdGdldDogZnVuY3Rpb24odCkge1xuXHRcdFx0cmV0dXJuICQodC5lbGVtKVt0LnByb3BdKCk7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHQpIHtcblx0XHRcdHZhciBjdXJyID0gdGhpcy5nZXQodCk7XG5cdFx0XHQvLyBJZiBpbnRlcnJ1cHQgaXMgdHJ1ZSBhbmQgdXNlciBzY3JvbGxlZCwgc3RvcCBhbmltYXRpbmdcblx0XHRcdGlmICh0Lm9wdGlvbnMuaW50ZXJydXB0ICYmIHQuX2xhc3QgJiYgdC5fbGFzdCAhPT0gY3Vycikge1xuXHRcdFx0XHRyZXR1cm4gJCh0LmVsZW0pLnN0b3AoKTtcblx0XHRcdH1cblx0XHRcdHZhciBuZXh0ID0gTWF0aC5yb3VuZCh0Lm5vdyk7XG5cdFx0XHQvLyBEb24ndCB3YXN0ZSBDUFVcblx0XHRcdC8vIEJyb3dzZXJzIGRvbid0IHJlbmRlciBmbG9hdGluZyBwb2ludCBzY3JvbGxcblx0XHRcdGlmIChjdXJyICE9PSBuZXh0KSB7XG5cdFx0XHRcdCQodC5lbGVtKVt0LnByb3BdKG5leHQpO1xuXHRcdFx0XHR0Ll9sYXN0ID0gdGhpcy5nZXQodCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEFNRCByZXF1aXJlbWVudFxuXHRyZXR1cm4gJHNjcm9sbFRvO1xufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9qcXVlcnkuc2Nyb2xsdG8vanF1ZXJ5LnNjcm9sbFRvLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwialF1ZXJ5XCJcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtmZXRjaEpzb259IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge0JBQ0tFTkRfSE9TVH0gZnJvbSAnLi9zZXR0aW5ncyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhY2tlbmQge1xuICAgIGFzeW5jIGdldFJhbmRvbVBhZ2VOYW1lKCkge1xuICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gJ9Cd0LUg0YPQtNCw0LvQvtGB0Ywg0L/QvtC70YPRh9C40YLRjCDRgdC70LXQtNGD0Y7RidGD0Y4g0YHRgtGA0LDQvdC40YbRgyDQtNC70Y8g0ZHRhNC40LrQsNGG0LjQuCc7XG4gICAgICAgIHJldHVybiBhd2FpdCBmZXRjaEpzb24oQkFDS0VORF9IT1NUICsgJy9yYW5kb21QYWdlTmFtZScsIHtlcnJvck1lc3NhZ2V9KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRSZXBsYWNlcyhwYWdlTmFtZSkge1xuICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gJ9Cf0YDQvtC40LfQvtGI0LvQsCDQvtGI0LjQsdC60LAg0L/RgNC4INC30LDQs9GA0YPQt9C60LUg0YHQv9C40YHQutCwINC30LDQvNC10L0nO1xuICAgICAgICByZXR1cm4gYXdhaXQgZmV0Y2hKc29uKEJBQ0tFTkRfSE9TVCArICcvcmVwbGFjZXMvJyArIHBhZ2VOYW1lLCB7ZXJyb3JNZXNzYWdlfSk7XG4gICAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2JhY2tlbmQuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gZXhwb3J0IGNvbnN0IEJBQ0tFTkRfSE9TVCA9ICdodHRwczovL3lvZmljYXRpb24uZGlyYXJpYS5ydSc7XG5leHBvcnQgY29uc3QgQkFDS0VORF9IT1NUID0gJ2h0dHA6Ly9sb2NhbGhvc3Qvd2lraXBlZGlhJztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zZXR0aW5ncy5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgdG9hc3QgZnJvbSAnLi90b2FzdCc7XG5pbXBvcnQge2ZldGNoSnNvbiwgcmVtb3ZlQXJndW1lbnRzRnJvbVVybH0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7bWFpbn0gZnJvbSAnLi9tYWluJ1xuaW1wb3J0IHtjdXJyZW50UGFnZU5hbWV9IGZyb20gXCIuL3dpa2lwZWRpYS1hcGlcIjtcblxuU3RyaW5nLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaSwgcywgbnVtYmVyQ2hhcnNUb1JlcGxhY2UpIHtcbiAgICByZXR1cm4gdGhpcy5zdWJzdHIoMCwgaSkgKyBzICsgdGhpcy5zdWJzdHIoaSArIG51bWJlckNoYXJzVG9SZXBsYWNlKTtcbn07XG5cblN0cmluZy5wcm90b3R5cGUuZ2V0SW5kZXhlc09mID0gZnVuY3Rpb24gKHMpIHtcbiAgICBsZXQgaW5kZXhlcyA9IFtdO1xuICAgIGxldCBzdGFydCA9IDA7XG4gICAgbGV0IHBvc2l0aW9uO1xuICAgIHdoaWxlICgocG9zaXRpb24gPSB0aGlzLmluZGV4T2Yocywgc3RhcnQpKSAhPT0gLTEpIHtcbiAgICAgICAgaW5kZXhlcy5wdXNoKHBvc2l0aW9uKTtcbiAgICAgICAgc3RhcnQgPSBwb3NpdGlvbiArIHMubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXhlcztcbn07XG5cblN0cmluZy5wcm90b3R5cGUuZGV5b2ZpY2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoJ9GRJywgJ9C1Jyk7XG59O1xuXG5TdHJpbmcucHJvdG90eXBlLmlzUnVzc2lhbkxldHRlckluV29yZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPT09IDEgJiYgdGhpcy5tYXRjaCgvW9CwLdGP0JAt0K/RkdCBXFwtXFx1MDBBRFxcdTAzMDFdLyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBZb2ZpY2F0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250aW51b3VzWW9maWNhdGlvbikge1xuICAgICAgICB0aGlzLmNvbnRpbnVvdXNZb2ZpY2F0aW9uID0gY29udGludW91c1lvZmljYXRpb247XG4gICAgICAgIHRoaXMudGV4dERpdiA9ICQoJyNtdy1jb250ZW50LXRleHQnKTtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0RGl2Lmh0bWwoKTtcbiAgICAgICAgdGhpcy5pUmVwbGFjZSA9IC0xO1xuICAgICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy53aWtpdGV4dCA9IG1haW4ud2lraXBlZGlhQXBpLmdldFdpa2l0ZXh0KGN1cnJlbnRQYWdlTmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgcGVyZm9ybSgpIHtcbiAgICAgICAgdG9hc3QoJ9CX0LDQs9GA0YPQttCw0LXQvCDRgdC/0LjRgdC+0Log0LfQsNC80LXQvS4uLicpO1xuICAgICAgICBsZXQge3JlcGxhY2VzLCByZXZpc2lvbn0gPSBhd2FpdCBtYWluLmJhY2tlbmQuZ2V0UmVwbGFjZXMoY3VycmVudFBhZ2VOYW1lKTtcbiAgICAgICAgdGhpcy5yZXBsYWNlcyA9IHJlcGxhY2VzO1xuXG4gICAgICAgIGxldCByZXZpc2lvbkxvY2FsID0gbXcuY29uZmlnLmdldCgnd2dDdXJSZXZpc2lvbklkJyk7XG4gICAgICAgIGlmIChyZXZpc2lvbiAhPT0gcmV2aXNpb25Mb2NhbCkge1xuICAgICAgICAgICAgdGhyb3cgYHJldmlzaW9uIGRvZXNuJ3QgbWF0Y2hcXG4gbG9jYWw6ICR7cmV2aXNpb25Mb2NhbH0gXFxucmVtb3RlOiAke3JldmlzaW9ufWA7XG4gICAgICAgIH1cblxuICAgICAgICByZXBsYWNlcyA9IHJlcGxhY2VzLmZpbHRlcihyZXBsYWNlID0+IHJlcGxhY2UuZnJlcXVlbmN5ID49IG1haW4uc2V0dGluZ3MubWluUmVwbGFjZUZyZXF1ZW5jeSk7XG4gICAgICAgIGlmIChyZXBsYWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRvYXN0KCfQrdGC0LAg0YHRgtGA0LDQvdC40YbQsCDQuCDRgtCw0Log0YPQttC1INGR0YTQuNGG0LjRgNC+0LLQsNC90LAuIFxcbijQndC1INC90LDQudC00LXQvdC+INC30LDQvNC10L0g0LTQu9GPINGN0YLQvtC5INGB0YLRgNCw0L3QuNGG0YspJyk7XG4gICAgICAgICAgICByZW1vdmVBcmd1bWVudHNGcm9tVXJsKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVwbGFjZXMuZm9yRWFjaChyZXBsYWNlID0+IHJlcGxhY2UuaXNBY2NlcHQgPSBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5nb1RvTmV4dFJlcGxhY2UoKTtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLnNjcm9sbFRvUmVwbGFjZSk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUFjdGlvbnMoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplQWN0aW9ucygpIHtcbiAgICAgICAgbGV0IGFjdGlvbnNBcnJheSA9IFtcbiAgICAgICAgICAgIFt0aGlzLmFjY2VwdFJlcGxhY2UsICdqJywgJ9C+J10sXG4gICAgICAgICAgICBbdGhpcy5yZWplY3RSZXBsYWNlLCAnZicsICfQsCddLFxuICAgICAgICAgICAgLy8g0LXRidGRINGA0LDQtyDQv9C+0LrQsNC30LDRgtGMINC/0L7RgdC70LXQtNC90Y7RjiDQt9Cw0LzQtdC90YNcbiAgICAgICAgICAgIFt0aGlzLnNob3dDdXJyZW50UmVwbGFjZUFnYWluLCAnOycsICfQtiddLFxuICAgICAgICAgICAgLy8g0LLQtdGA0L3Rg9GC0YzRgdGPINC6INC/0YDQtdC00YvQtNGD0YnQtdC5INC30LDQvNC10L3QtVxuICAgICAgICAgICAgW3RoaXMuZ29Ub1ByZXZpb3VzUmVwbGFjZSwgJ2EnLCAn0YQnXVxuICAgICAgICBdO1xuXG4gICAgICAgIGxldCBhY3Rpb25zID0ge307XG4gICAgICAgIGZvciAobGV0IGFjdGlvbiBvZiBhY3Rpb25zQXJyYXkpIHtcbiAgICAgICAgICAgIGxldCBhY3Rpb25GdW5jdGlvbiA9IGFjdGlvblswXTtcbiAgICAgICAgICAgIGxldCBrZXlzID0gYWN0aW9uLnNsaWNlKDEpO1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zW2tleV0gPSBhY3Rpb25GdW5jdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICQoZG9jdW1lbnQpLmtleXByZXNzKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kb25lICYmIGV2ZW50LmtleSBpbiBhY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnNbZXZlbnQua2V5XSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnb1RvTmV4dFJlcGxhY2UoKSB7XG4gICAgICAgIHdoaWxlICghdGhpcy5nb1RvUmVwbGFjZSgrK3RoaXMuaVJlcGxhY2UpKSB7fVxuICAgIH1cblxuICAgIGdvVG9QcmV2aW91c1JlcGxhY2UoKSB7XG4gICAgICAgIC0tdGhpcy5pUmVwbGFjZTtcbiAgICAgICAgd2hpbGUgKHRoaXMuaVJlcGxhY2UgPj0gMCAmJiAhdGhpcy5nb1RvUmVwbGFjZSh0aGlzLmlSZXBsYWNlKSkge1xuICAgICAgICAgICAgLS10aGlzLmlSZXBsYWNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlSZXBsYWNlIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5pUmVwbGFjZSA9IDA7XG4gICAgICAgICAgICB0aHJvdyAnZ29Ub1ByZXZpb3VzUmVwbGFjZTogaVJlcGxhY2UgPCAwJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcGxhY2VzW3RoaXMuaVJlcGxhY2VdLmlzQWNjZXB0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZ29Ub1JlcGxhY2UoaVJlcGxhY2UpIHtcbiAgICAgICAgaWYgKHRoaXMuaVJlcGxhY2UgPT09IHRoaXMucmVwbGFjZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnRleHREaXYuaHRtbCh0ZXh0KTtcbiAgICAgICAgICAgIHRoaXMubWFrZUNoYW5nZSh0aGlzLmNvbnRpbnVvdXNZb2ZpY2F0aW9uID8gdGhpcy5nb1RvTmV4dFBhZ2UgOiByZW1vdmVBcmd1bWVudHNGcm9tVXJsKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlSZXBsYWNlID4gdGhpcy5yZXBsYWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93ICdnb1RvUmVwbGFjZTogaVJlcGxhY2UgPiByZXBsYWNlcy5sZW5ndGgnO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlcGxhY2UgPSB0aGlzLnJlcGxhY2VzW2lSZXBsYWNlXTtcbiAgICAgICAgbGV0IHlvd29yZCA9IHJlcGxhY2UueW93b3JkO1xuICAgICAgICBsZXQgc3RhdHVzID0gJ9CX0LDQvNC10L3QsCAnICsgKHRoaXMuaVJlcGxhY2UgKyAxKSArICcg0LjQtyAnICsgdGhpcy5yZXBsYWNlcy5sZW5ndGggKyAnXFxuJyArIHlvd29yZCArICdcXG7Qp9Cw0YHRgtC+0YLQsDogJyArIHJlcGxhY2UuZnJlcXVlbmN5ICsgJyUnO1xuICAgICAgICB0b2FzdChzdGF0dXMpO1xuICAgICAgICBsZXQgaW5kZXhlcyA9IHRoaXMudGV4dC5nZXRJbmRleGVzT2YoeW93b3JkLmRleW9maWNhdGlvbigpKTtcblxuICAgICAgICAvLyDQuNCz0L3QvtGA0LjRgNGD0LXQvCDQstGF0L7QttC00LXQvdC40Y8gZHdvcmQg0LLQvdGD0YLRgNC4INGB0LvQvtCyXG4gICAgICAgIGluZGV4ZXMgPSBpbmRleGVzLmZpbHRlcihpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaiA9IGkgKyB5b3dvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHJldHVybiAoaSA9PT0gMCB8fCAhdGhpcy50ZXh0W2kgLSAxXS5pc1J1c3NpYW5MZXR0ZXJJbldvcmQoKSkgJiYgKGogPT09IHRoaXMudGV4dC5sZW5ndGggfHwgIXRoaXMudGV4dFtqXS5pc1J1c3NpYW5MZXR0ZXJJbldvcmQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8g0LLRi9C00LXQu9GP0LXQvCDRhtCy0LXRgtC+0LxcbiAgICAgICAgaWYgKGluZGV4ZXMubGVuZ3RoICE9PSByZXBsYWNlLm51bWJlclNhbWVEd29yZHMpIHtcbiAgICAgICAgICAgIHRvYXN0KHN0YXR1cyArICdcXG7Qn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1OiDQvdC1INGB0L7QstC/0LDQtNCw0LXRgiBudW1iZXJTYW1lRHdvcmRzXFxu0J3QsNC50LTQtdC90L46ICcgKyBpbmRleGVzLmxlbmd0aCArICdcXG7QlNC+0LvQttC90L4g0LHRi9GC0Yw6ICcgKyByZXBsYWNlLm51bWJlclNhbWVEd29yZHMgKyAnIFxcbijQuNC90LTQtdC60YHRiyDQvdCw0LnQtNC10L3QvdGL0YU6ICcgKyBpbmRleGVzICsgJyknKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgd29yZEluZGV4U3RhcnQgPSBpbmRleGVzW3JlcGxhY2UubnVtYmVyU2FtZUR3b3Jkc0JlZm9yZV07XG4gICAgICAgIGxldCB0ZXh0TmV3ID0gdGhpcy50ZXh0Lmluc2VydCh3b3JkSW5kZXhTdGFydCwgJzxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZDogY3lhbjtcIiBpZD1cInlvZmljYXRpb24tcmVwbGFjZVwiPicgKyB5b3dvcmQgKyAnPC9zcGFuPicsIHlvd29yZC5sZW5ndGgpO1xuICAgICAgICB0aGlzLnRleHREaXYuaHRtbCh0ZXh0TmV3KTtcblxuICAgICAgICAvLyDQv9GA0L7QstC10YDRj9C10Lwg0L3QsCDQstC40LTQuNC80L7RgdGC0YxcbiAgICAgICAgaWYgKCEkKCcjeW9maWNhdGlvbi1yZXBsYWNlJykuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQn9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1OiDQt9Cw0LzQtdC90LAg0L3QtSDQstC40LTQvdCwJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDRgdC60YDQvtC70LvQuNC8XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9SZXBsYWNlKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFjY2VwdFJlcGxhY2UoKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZXNbaVJlcGxhY2VdLmlzQWNjZXB0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nb1RvTmV4dFJlcGxhY2UoKTtcbiAgICB9XG5cbiAgICByZWplY3RSZXBsYWNlKCkge1xuICAgICAgICB0aGlzLmdvVG9OZXh0UmVwbGFjZSgpO1xuICAgIH1cblxuICAgIHNob3dDdXJyZW50UmVwbGFjZUFnYWluKCkge1xuICAgICAgICB0aGlzLnNjcm9sbFRvUmVwbGFjZSgpO1xuICAgIH1cblxuICAgIHNjcm9sbFRvUmVwbGFjZSgpIHtcbiAgICAgICAgbGV0IHJlcGxhY2UgPSAkKCcjeW9maWNhdGlvbi1yZXBsYWNlJyk7XG4gICAgICAgIGlmIChyZXBsYWNlLmxlbmd0aCkge1xuICAgICAgICAgICAgJC5zY3JvbGxUbyhyZXBsYWNlLCB7b3ZlcjogMC41LCBvZmZzZXQ6IC0kKHdpbmRvdykuaGVpZ2h0KCkgLyAyfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBtYWtlQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgICAgICBsZXQgcmVwbGFjZXNSaWdodCA9IHRoaXMucmVwbGFjZXMuZmlsdGVyKHJlcGxhY2UgPT4gcmVwbGFjZS5pc0FjY2VwdCk7XG4gICAgICAgIGlmIChyZXBsYWNlc1JpZ2h0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdG9hc3QoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvYXN0KCfQlNC10LvQsNC10Lwg0L/RgNCw0LLQutGDOiBcXG7Ql9Cw0LPRgNGD0LbQsNC10Lwg0LLQuNC60LjRgtC10LrRgdGCINGB0YLRgNCw0L3QuNGG0YsuLi4nKTtcbiAgICAgICAgbGV0IHdpa2l0ZXh0ID0gYXdhaXQgdGhpcy53aWtpdGV4dDtcbiAgICAgICAgdG9hc3QoJ9CU0LXQu9Cw0LXQvCDQv9GA0LDQstC60YM6IFxcbtCf0YDQuNC80LXQvdGP0LXQvCDQt9Cw0LzQtdC90YsuLi4nKTtcbiAgICAgICAgbGV0IHJlcGxhY2VTb21ldGhpbmcgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXBsYWNlc1JpZ2h0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsZXQgcmVwbGFjZSA9IHJlcGxhY2VzUmlnaHRbaV07XG4gICAgICAgICAgICBsZXQgeW93b3JkID0gcmVwbGFjZS55b3dvcmQ7XG4gICAgICAgICAgICBpZiAod2lraXRleHQuc3Vic3RyKHJlcGxhY2Uud29yZEluZGV4U3RhcnQsIHlvd29yZC5sZW5ndGgpICE9PSB5b3dvcmQuZGV5b2ZpY2F0aW9uKCkpIHtcbiAgICAgICAgICAgICAgICBleGl0KCfQntGI0LjQsdC60LA6INCy0LjQutC40YLQtdC60YHRgiDRgdGC0YDQsNC90LjRhtGLIFwiJyArIGN1cnJlbnRQYWdlTmFtZSArICdcIiDQvdC1INGB0L7QstC/0LDQtNCw0LXRgiDQsiDQuNC90LTQtdC60YHQtSAnICsgcmVwbGFjZS53b3JkSW5kZXhTdGFydFxuICAgICAgICAgICAgICAgICAgICArICdcXG7Qn9C+0LbQsNC70YPQudGB0YLQsCwg0YHQvtC+0LHRidC40YLQtSDQvdCw0LfQstCw0L3QuNC1INGN0YLQvtC5INGB0YLRgNCw0L3QuNGG0YsgW1vQo9GH0LDRgdGC0L3QuNC6OtCU0LjQvNCwNzR80LDQstGC0L7RgNGDINGB0LrRgNC40L/RgtCwXV0uJ1xuICAgICAgICAgICAgICAgICAgICArICdcXG7QvtC20LjQtNCw0LXRgtGB0Y86IFwiJyArIHlvd29yZC5kZXlvZmljYXRpb24oKSArICdcIidcbiAgICAgICAgICAgICAgICAgICAgKyAnXFxu0L/QvtC70YPRh9C10L3QvjogXCInICsgd2lraXRleHQuc3Vic3RyKHJlcGxhY2Uud29yZEluZGV4U3RhcnQsIHlvd29yZC5sZW5ndGgpICsgJ1wiJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpa2l0ZXh0ID0gd2lraXRleHQuaW5zZXJ0KHJlcGxhY2Uud29yZEluZGV4U3RhcnQsIHlvd29yZCwgeW93b3JkLmxlbmd0aCk7XG4gICAgICAgICAgICByZXBsYWNlU29tZXRoaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXBsYWNlU29tZXRoaW5nKSB7XG4gICAgICAgICAgICB0b2FzdCgn0JTQtdC70LDQtdC8INC/0YDQsNCy0LrRgzogXFxu0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LjQt9C80LXQvdC10L3QuNGPLi4uJyk7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaEpzb24oJy93L2FwaS5waHAnLCB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAn0J3QtSDRg9C00LDQu9C+0YHRjCDQv9GA0L7QuNC30LLQtdGB0YLQuCDQv9GA0LDQstC60YMnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdlZGl0JyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGN1cnJlbnRQYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbWlub3I6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHdpa2l0ZXh0LFxuICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5OiBtYWluLnNldHRpbmdzLmVkaXRTdW1tYXJ5LFxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogbXcudXNlci50b2tlbnMuZ2V0KCdlZGl0VG9rZW4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5lZGl0IHx8IHJlc3BvbnNlLmVkaXQucmVzdWx0ICE9PSAnU3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdG9hc3QoJ9Cd0LUg0YPQtNCw0LvQvtGB0Ywg0L/RgNC+0LjQt9Cy0LXRgdGC0Lgg0L/RgNCw0LLQutGDOiAnICsgKGRhdGEuZWRpdCA/IGRhdGEuZWRpdC5pbmZvIDogJ9C90LXQuNC30LLQtdGB0YLQvdCw0Y8g0L7RiNC40LHQutCwJykpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvYXN0KCfQn9GA0LDQstC60LAg0LLRi9C/0L7Qu9C10L3QsCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ29Ub05leHRQYWdlKCkge1xuICAgICAgICBtYWluLnBlcmZvcm1Db250aW51b3VzWW9maWNhdGlvbigpO1xuICAgIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy95b2ZpY2F0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=
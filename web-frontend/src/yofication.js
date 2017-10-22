import toast from './toast';
import {assert, fetchJson, removeArgumentsFromUrl} from './base';
import {main} from './main';
import {currentPageName} from './wikipedia-api';
import StringHelper from './string-helper';
import {WIKTIONARY_URL} from './settings';

String.prototype.insert = function (i, s, numberCharsToReplace) {
    return this.substr(0, i) + s + this.substr(i + numberCharsToReplace);
};

export default class Yofication {
    constructor(pageMode) {
        this.pageMode = pageMode;
        if (this.pageMode) {
            this.root = document.getElementById('mw-content-text');
            this.rootInner = this.root.childNodes[0];
            assert(this.rootInner.classList.contains('mw-parser-output'));
            this.wikitextPromise = main.wikipediaApi.getWikitext(currentPageName);
        } else {
            this.root = document.getElementById('wpTextbox1');
            this.root.blur();

            this.root.parentElement.style.position = 'relative';
            this.root.parentElement.style.overflowY = 'hidden';
            // https://ru.wikipedia.org/wiki/Википедия:Форум/Технический#.D0.9F.D0.BE.D0.BB.D0.BE.D1.81.D0.B0_.D0.B2_.D1.80.D0.B5.D0.B4.D0.B0.D0.BA.D1.82.D0.BE.D1.80.D0.B5_.D0.B2.D0.B8.D0.BA.D0.B8.D1.82.D0.B5.D0.BA.D1.81.D1.82.D0.B0_.D0.BC.D0.B5.D0.B6.D0.B4.D1.83_.D0.BF.D0.B0.D0.BD.D0.B5.D0.BB.D1.8C.D1.8E_.D0.B8.D0.BD.D1.81.D1.82.D1.80.D1.83.D0.BC.D0.B5.D0.BD.D1.82.D0.BE.D0.B2_.D0.B8_.D0.BF.D0.BE.D0.BB.D0.B5.D0.BC_.D1.80.D0.B5.D0.B4.D0.B0.D0.BA.D1.82.D0.BE.D1.80.D0.B0
            if (this.root.previousElementSibling) {
                this.root.previousElementSibling.style.marginTop = 0;
            }

            this.highlightsWrapper = document.createElement('div');
            this.highlightsWrapper.style.position = 'absolute';
            this.highlightsWrapper.style.top = 0;
            this.highlightsWrapper.style.left = 0;
            this.root.parentElement.appendChild(this.highlightsWrapper);
            this.root.addEventListener('scroll', () => {
                this.highlightsWrapper.style.top = -this.root.scrollTop + 'px';
            });

            let rootStyle = window.getComputedStyle(this.root);
            this.fakeElement = document.createElement('div');
            this.fakeElement.id = 'fakeElement';
            this.fakeElement.textContent = this.root.value;

            this.fakeElement.style.fontFamily = rootStyle.fontFamily;
            this.fakeElement.style.fontSize = rootStyle.fontSize;
            this.fakeElement.style.lineHeight = rootStyle.lineHeight;
            this.fakeElement.style.border = '1px solid transparent';
            this.fakeElement.style.boxSizing = rootStyle.boxSizing;
            this.fakeElement.style.overflowY = rootStyle.overflowY;
            this.fakeElement.style.overflowX = rootStyle.overflowX;
            this.fakeElement.style.padding = rootStyle.padding;
            this.fakeElement.style.wordWrap = rootStyle.wordWrap;
            this.fakeElement.style.tabSize = rootStyle.tabSize;
            this.fakeElement.style.whiteSpace = rootStyle.whiteSpace;

            this.fakeElement.style.marginTop = '-' + rootStyle.height;
            this.fakeElement.style.marginBottom = 0;
            this.fakeElement.style.marginLeft = 0;
            this.fakeElement.style.marginRight = 0;
            this.fakeElement.style.height = rootStyle.height;
            this.fakeElement.style.visibility = 'hidden';
            this.root.parentElement.appendChild(this.fakeElement);
        }

        this.iReplace = -1;
        this.done = false;
        this.ignoredDwords = new Set();
    }

    async perform() {
        await this.loadReplaces();
        if (this.pageMode) {
            // ёфицировать можно не обязательно статью, это может быть раздел статьи и т.д. (то есть у этого может не быть ревизии)
            this.checkRevisionsMatch();
            // при ёфикации викитекст не важен, так как результатом работы скрипта будет изменнение содержимого <textarea>
            await this.checkWikitextMatch();
        }
        toast('Обрабатываем замены...');
        this.createHighlights();
        this.createReplaces();

        if (this.replaces.length === 0) {
            toast('Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)');
            this.afterYofication();
            return;
        }

        // if (this.replaces.length < main.settings.minimumNumberReplacesForContinuousYofication) {
        //     toast('assert: this.replaces.length < main.settings.minimumNumberReplacesForContinuousYofication');
        //     this.afterYofication();
        //     return;
        // }

        // if (this.wikitext.length > 50000) {
        //     toast('temp: викитекст слишком большой');
        //     this.afterYofication();
        //     return;
        // }

        this.goToNextReplace();
        $(window).on('resize', () => this.scrollToCurrentVisibleHighlight());
        this.initializeActions();
    }

    async loadReplaces() {
        toast('Загружаем список замен...');
        if (this.pageMode) {
            let {yowordsToReplaces, revision, timestamp, wikitextLength} = await main.backend.getReplacesByPageName(currentPageName);
            this.yowordsToReplaces = yowordsToReplaces;
            this.revision = revision;
            this.timestamp = timestamp;
            this.wikitextLength = wikitextLength;
        } else {
            let wikitext = this.root.value;
            this.yowordsToReplaces = await main.backend.getReplacesByWikitext(wikitext);
        }
        this.yowords = Object.keys(this.yowordsToReplaces);
    }

    checkRevisionsMatch() {
        let revisionLocal = mw.config.get('wgCurRevisionId');
        if (this.revision !== revisionLocal) {
            throw `ревизии не совпадают\n локальная: ${revisionLocal} \nожидается: ${this.revision}`;
        }
    }

    async checkWikitextMatch() {
        toast('Загружаем викитекст...');
        this.wikitext = await this.wikitextPromise;
        console.log(`длина викитекста: ${this.wikitext.length}`);
        if (this.wikitext.length !== this.wikitextLength) {
            // в javascript строки в utf16
            // в python строки в utf32
            // если в викитексте встречается символ, который кодируется двумя символами в utf16,
            // то всё плохо, потому что результатом ёфикации является изменение викитекста, согласно индексам принятых замен, а индексы берутся из python
            // при ёфикации в редакторе всё хорошо, потому что в этом случае мы не используем индексы из python, а используем индексы, полученные при локальном сопоставлении
            // впринципе можно и для page-ёфикации сделать повторное сопоставление по контексту...
            console.error(`
длина викитекста не совпадает
local (javascript): ${this.wikitext.length}
remote (python): ${this.wikitextLength}`);
            assert(false, 'К сожалению, скрипт не может обработать эту страницу\nПожалуйста, воспользуйтесь ёфикацией из режима редактирования страницы');
        }
        for (let yoword of this.yowords) {
            let yowordInfo = this.yowordsToReplaces[yoword];
            assert(yowordInfo.frequency >= main.settings.minimumReplaceFrequency);
            let dwordRemote = StringHelper.deyoficate(yoword);
            for (let replace of yowordInfo.replaces) {
                let dwordLocal = this.wikitext.substr(replace.wordStartIndex, dwordRemote.length);
                if (dwordLocal !== dwordRemote) {
                    let wikitextRemote = await main.wikipediaApi.getWikitext(currentPageName);
                    StringHelper.compareStringSummary(this.wikitext, wikitextRemote, 'викитекст');
                    throw `викитекст страницы "${currentPageName}" не совпадает в индексе ${replace.wordStartIndex}`
                    + `\nожидается: ${dwordRemote}"`
                    + `\nполучено: "${dwordLocal}"`;
                }
            }
        }
    }

    static getColorRGB(value) {
        let r = Math.round((1 - value) * 255);
        let g = Math.round(value * 255);
        let b = Math.round(0);
        return `rgb(${r}, ${g}, ${b})`;
    }

    static getColorHSL(value) {
        let hue = Math.round(value * 120);
        return `hsl(${hue}, 100%, 50%)`;
    }

    static getColorSimple(value) {
        const limits = [
            [0.6, 'green'],
            [0.4, 'orange'],
            [0.0, 'red']
        ];
        for (let limit of limits) {
            if (value >= limit[0]) {
                return limit[1];
            }
        }
        assert(false, 'getColorSimple::assert(false)');
    }

    addProgressToHighlight(highlightElement, frequencyPercent) {
        // const getColor = Yofication.getColorRGB;
        // const getColor = Yofication.getColorHSL;
        const getColor = Yofication.getColorSimple;

        let value = frequencyPercent / 100;
        let progress = document.createElement('span');
        highlightElement.appendChild(progress);
        let progressHeight = this.pageMode ? 3 : 5;
        $(progress).css({
            width: `${frequencyPercent}%`,
            backgroundColor: getColor(value),
            content: '',
            height: `${progressHeight}px`,
            position: 'absolute',
            left: '0',
            top: `-${progressHeight}px`
        });
    }

    createHighlights() {
        let yowordsInfos = {};
        for (let yoword of this.yowords) {
            yowordsInfos[yoword] = [];
        }

        let nodeOrderIndex = 0;
        let processTextNode = (node, nodeValue) => {
            for (let yoword of this.yowords) {
                let dword = StringHelper.deyoficate(yoword);
                if (nodeValue.includes(dword)) {
                    assert(nodeValue);
                    let indexes = StringHelper.findIndexesOfWord(dword, nodeValue);
                    let occurrences = indexes.map(wordStartIndex => { return {wordStartIndex, wordNode: node, wordNodeValue: nodeValue, wordOrderIndex: [nodeOrderIndex, wordStartIndex]}; });
                    yowordsInfos[yoword].push(...occurrences);
                }
            }
            ++nodeOrderIndex;
        };

        if (this.pageMode) {
            let filter = {
                acceptNode: (node) => {
                    let visible = node.offsetParent !== null;
                    return visible ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            };
            let walker = document.createTreeWalker(this.root, NodeFilter.SHOW_ALL, filter);
            while (walker.nextNode()) {
                let node = walker.currentNode;
                if (node.nodeType === 3) {
                    processTextNode(node, node.nodeValue);
                }
            }
        } else {
            // вообще this.root это Element, а не Node
            processTextNode(this.root, this.root.value);
        }

        for (let yoword of this.yowords) {
            let occurrences = [];
            for (let occurrence of yowordsInfos[yoword]) {
                if (!this.pageMode) {
                    occurrence.wordNode = this.fakeElement.childNodes[0];
                }

                let range = document.createRange();
                range.setStart(occurrence.wordNode, occurrence.wordStartIndex);
                range.setEnd(occurrence.wordNode, occurrence.wordStartIndex + yoword.length);

                let highlightElement = document.createElement('span');
                // https://stackoverflow.com/questions/46505758/why-offsetparent-returns-nearest-table-for-non-positioned-element
                highlightElement.style.position = 'absolute';
                if (this.pageMode) {
                    occurrence.wordNode.before(highlightElement);
                    highlightElement.parentElement.style.isolation = 'isolate';
                    // верхней строчки недостаточно из-за бага в хроме
                    // https://stackoverflow.com/questions/46621884/different-behaviour-of-isolation-isolate-when-div-is-inside-table
                    highlightElement.parentElement.style.opacity = 0.99;
                } else {
                    this.highlightsWrapper.appendChild(highlightElement);
                    let wordElement = document.createElement('div');
                    wordElement.style.fontFamily = this.fakeElement.style.fontFamily;
                    wordElement.style.fontSize = this.fakeElement.style.fontSize;
                    wordElement.style.lineHeight = this.fakeElement.style.lineHeight;
                    wordElement.style.display = 'flex';
                    wordElement.style.alignItems = 'center';
                    wordElement.style.justifyContent = 'center';
                    wordElement.innerHTML = StringHelper.deyoficate(yoword);
                    highlightElement.appendChild(wordElement);
                }

                this.addProgressToHighlight(highlightElement, this.yowordsToReplaces[yoword].frequency);

                let recalcPosition = () => {
                    let rect = range.getBoundingClientRect();
                    let root = this.pageMode ? highlightElement.offsetParent : this.root;
                    let rootRect = root.getBoundingClientRect();

                    let padding = this.pageMode ? 2 : 2;
                    let left = rect.left - padding;
                    let top = rect.top - padding;
                    let width = rect.width + padding * 2;
                    let height = rect.height + padding * 2;
                    left -= rootRect.left;
                    top -= rootRect.top;
                    $(highlightElement).css({left, top, width, height});

                    if (!this.pageMode) {
                        let wordElement = highlightElement.childNodes[0];
                        $(wordElement).css({width, height});
                    }
                };

                // todo ask on SO is adding functions to HTMLElement instance allowed
                highlightElement.recalcPosition = recalcPosition;
                highlightElement.recalcPosition();

                $(highlightElement).css({
                    background: 'aquamarine',
                    display: 'none'
                });
                if (this.pageMode) {
                    $(highlightElement).css('zIndex', -1);
                }

                if (this.checkWordNode(occurrence.wordNode, yoword)) {
                    occurrence.highlightElement = highlightElement;
                    occurrences.push(occurrence);
                }
            }
            this.yowordsToReplaces[yoword].occurrences = occurrences;
        }
    }

    checkWordNode(wordNode, yoword) {
        if (!this.pageMode) {
            return true;
        }
        for (let element = wordNode; element !== this.root; element = element.parentElement) {
            if (element.nodeType === 1) {
                // цитаты, ссылки
                const ignoredTags = ['blockquote', 'a', 'pre'];
                for (let ignoredTag of ignoredTags) {
                    if (element.tagName.toLowerCase() === ignoredTag) {
                        console.log(`ignore word "${yoword}" inside <${ignoredTag}>`);
                        return false;
                    }
                }

                // поэмы
                const ignoredClasses = ['poem'];
                for (let ignoredClass of ignoredClasses) {
                    if (element.classList.contains(ignoredClass)) {
                        console.log(`ignore word "${yoword}" inside .${ignoredClass}`);
                        return false;
                    }
                }

                // содержание
                if (element.id === 'toc') {
                    console.log(`ignore word "${yoword}" inside #toc`);
                    return false;
                }

                // цитаты из шаблона {{Quote}}
                let previousElement = element.previousElementSibling;
                if (element.tagName === 'TD' && previousElement !== null && previousElement.tagName === 'TD' && previousElement.innerHTML.includes('quote1.png')) {
                    console.log(`ignore word "${yoword}" inside quote`);
                    return false;
                }
            }

            // секции типа Литература
            if (element.parentElement === this.rootInner) {
                // верхний уровень, проверяем что ближайший заголовок сверху допустимый
                for (let previousElement = element; previousElement !== null; previousElement = previousElement.previousSibling) {
                    if (previousElement.nodeType === 1 && previousElement.tagName[0] === 'H' && previousElement.childNodes.length > 0) {
                        const sectionsIgnored = ['литература', 'ссылки', 'примечания', 'сочинения', 'источники', 'труды', 'источники и литература'];
                        let latestSectionName = previousElement.childNodes[0].id;
                        if (sectionsIgnored.includes(latestSectionName.toLowerCase())) {
                            console.log(`ignore word "${yoword}" in section "${latestSectionName}"`);
                            return false;
                        }
                        break;
                    }
                }
            }
        }
        return true;
    }

    getCommonLength(contextBefore, contextAfter, replaceInfo) {
        // todo сопоставление с учётом &nbsp;
        let lengthBefore = StringHelper.longestSuffix(contextBefore, replaceInfo.contextBefore);
        let lengthAfter = StringHelper.longestPrefix(contextAfter, replaceInfo.contextAfter);
        return lengthBefore + lengthAfter;
    }

    createReplaces() {
        let replacesLocal = [];
        for (let yoword of this.yowords) {
            let yowordInfo = this.yowordsToReplaces[yoword];

            let yowordReplaces = [];
            const contextLength = 30;
            for (let occurrence of yowordInfo.occurrences) {
                let wordNodeValue = occurrence.wordNodeValue;
                let wordNodeStartIndex = occurrence.wordStartIndex;
                let wordNodeEndIndex = occurrence.wordStartIndex + yoword.length;
                let contextBefore = wordNodeValue.substring(Math.max(wordNodeStartIndex - contextLength, 0), wordNodeStartIndex);
                let contextAfter = wordNodeValue.substring(wordNodeEndIndex, Math.min(wordNodeEndIndex + contextLength, wordNodeValue.length));
                // перед сортировкой обязательно нужно создать копию массива
                // сейчас копию создаётся в процессе `map`
                let replaces = yowordInfo.replaces
                    .map(replace => { return {replace, commonLength: this.getCommonLength(contextBefore, contextAfter, replace)}; })
                    .sort((replace1, replace2) => replace2.commonLength - replace1.commonLength);
                // найденное число вхождений, ожидаемое число вхождений, результат
                //  1,  1, сопоставляем
                // >1,  1, выбираем из найденных замен лучшую подходящую
                //  1, >1, подбираем для найденной замены лучшую ожидаемую
                // >1, >1, по контексту
                let numberReplacesLocal = yowordInfo.occurrences.length;
                let numberReplacesRemote = replaces.length;
                let singleLocalSingleRemote = numberReplacesLocal === 1 && numberReplacesRemote === 1 && replaces[0].commonLength >= 10;
                let multipleLocalSingleRemote = numberReplacesLocal > 1 && numberReplacesRemote === 1 && replaces[0].commonLength >= 20;
                let multipleRemote = numberReplacesRemote > 1 && replaces[0].commonLength >= 10 && replaces[0].commonLength > replaces[1].commonLength * 1.5;
                if (singleLocalSingleRemote || multipleLocalSingleRemote || multipleRemote) {
                    let replaceRemote = replaces[0];

                    let replace = {
                        yoword,
                        wordStartIndex: replaceRemote.replace.wordStartIndex,
                        frequency: yowordInfo.frequency,
                        highlightInfo: occurrence,
                        isAccept: false
                    };
                    assert(replace.wordStartIndex !== undefined);

                    let indexRemote = yowordInfo.replaces.indexOf(replaceRemote.replace);
                    assert(indexRemote !== -1, 'indexRemote === -1');
                    yowordReplaces.push({replace, indexRemote});
                }
            }

            let indexesRemote = yowordReplaces.map(replace => replace.indexRemote);
            let checkSingleMatching = (new Set(indexesRemote)).size === indexesRemote.length;
            if (checkSingleMatching) {
                for (let {replace, indexRemote} of yowordReplaces) {
                    replacesLocal.push(replace);
                }
            } else {
                console.error(`${yoword}\nНесколько локальных вхождений были сопоставлены одному remote\n${indexesRemote}`);
                // assert(false, 'checkSingleMatching');
            }
        }
        const compareTwoElementArrays = (a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
        replacesLocal.sort((replace1, replace2) => compareTwoElementArrays(replace1.highlightInfo.wordOrderIndex, replace2.highlightInfo.wordOrderIndex));
        for (let replace of replacesLocal) {
            replace.highlightElement = replace.highlightInfo.highlightElement;
        }

        // статистика сопоставления замен
        console.log('');
        console.log(`${'yoword'.padEnd(20 - 'local'.length + 1)} local:remote => associated`);
        for (let yoword of this.yowords) {
            let yowordInfo = this.yowordsToReplaces[yoword];
            let numberLocal = yowordInfo.occurrences.length;
            let numberRemote = yowordInfo.replaces.length;
            let numberAssociated = replacesLocal.filter(replace => replace.yoword === yoword).length;
            console.log(`${yoword.padEnd(20)} ${numberLocal}:${numberRemote} => ${numberAssociated}`);
        }
        console.log('');

        this.replaces = replacesLocal;
    }

    initializeActions() {
        let actionsArray = [
            [this.acceptReplace, 'j', 'о'],
            [this.rejectReplace, 'f', 'а'],
            [this.rejectReplaceAndAllSameDwords, 'g', 'п'],
            // ещё раз показать последнюю замену
            [this.showCurrentReplaceAgain, ';', 'ж'],
            // вернуться к предыдущей замене
            [this.goToPreviousReplace, 'a', 'ф'],
            // отменить ёфикация текущей страницы
            [this.abortYofication, 'q', 'й'],
            // открыть страницу со словом в викисловаре
            [this.openYowordWiktionaryPage, 'w', 'ц']
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
                    actions[event.key].call(this);
                }
            }
        );
    }

    goToNextReplace() {
        assert(this.iReplace !== this.replaces.length);
        do {
            ++this.iReplace;
        } while (!this.goToCurrentReplace());
    }

    goToPreviousReplace() {
        if (this.iReplace === 0) {
            return;
        }
        --this.iReplace;
        while (this.iReplace >= 0 && !this.goToCurrentReplace()) {
            --this.iReplace;
        }
        if (this.iReplace < 0) {
            this.iReplace = 0;
            throw 'goToPreviousReplace: iReplace < 0';
        }
        this.replaces[this.iReplace].isAccept = false;
    }

    goToCurrentReplace() {
        if (this.iReplace === this.replaces.length) {
            this.makeChange().then(() => this.afterYofication());
            return true;
        }
        if (this.iReplace > this.replaces.length) {
            throw 'goToCurrentReplace: iReplace > replaces.length';
        }

        let replace = this.replaces[this.iReplace];
        let yoword = replace.yoword;

        let dword = StringHelper.deyoficate(yoword);
        if (this.ignoredDwords.has(dword)) {
            return false;
        }

        let status = `${replace.frequency}%\n${yoword}\nЗамена ${this.iReplace + 1} из ${this.replaces.length}`;
        toast(status);

        if (this.visibleHighlight) {
            this.visibleHighlight.style.display = 'none';
        }
        replace.highlightElement.style.display = 'block';
        this.visibleHighlight = replace.highlightElement;
        this.scrollToCurrentVisibleHighlight();
        return true;
    }

    acceptReplace() {
        this.replaces[this.iReplace].isAccept = true;
        this.goToNextReplace();
    }

    rejectReplace() {
        this.goToNextReplace();
    }

    rejectReplaceAndAllSameDwords() {
        let replace = this.replaces[this.iReplace];
        let dword = StringHelper.deyoficate(replace.yoword);
        this.ignoredDwords.add(dword);
        this.rejectReplace();
    }

    showCurrentReplaceAgain() {
        this.scrollToCurrentVisibleHighlight();
    }

    scrollToCurrentVisibleHighlight() {
        if (this.visibleHighlight) {
            let highlight = this.visibleHighlight;
            highlight.recalcPosition();
            let highlightRect = highlight.getBoundingClientRect();
            if (this.pageMode) {
                let y = (window.scrollY + highlightRect.top) - (window.innerHeight - highlightRect.height) / 2;
                window.scrollTo(0, y);
            } else {
                let y = parseInt(highlight.style.top) - (this.root.clientHeight - highlightRect.height) / 2;
                this.root.scrollTop = y;
                this.highlightsWrapper.style.top = -this.root.scrollTop + 'px';
            }
        }
    }

    async makeChange() {
        if (this.visibleHighlight) {
            this.visibleHighlight.style.display = 'none';
            delete this.visibleHighlight;
        }

        this.done = true;
        this.replaces = this.replaces.filter(replace => replace.isAccept);
        if (this.replaces.length === 0) {
            toast('Ёфикация завершена\n(ни одна замена не была принята)');
            return;
        }

        if (this.pageMode) {
            await this.makeChangePageMode();
        } else {
            this.makeChangeEditMode();
        }
    }

    async makeChangePageMode() {
        let wikitext = this.wikitext;
        toast('Делаем правку: \nПрименяем замены...');
        let replaceSomething = false;
        for (let replace of this.replaces) {
            let yoword = replace.yoword;
            // todo
            assert(replace.wordStartIndex !== undefined);
            assert(yoword !== undefined);
            wikitext = wikitext.insert(replace.wordStartIndex, yoword, yoword.length);
            replaceSomething = true;
        }
        StringHelper.assertNewStringIsYoficatedVersionOfOld(this.wikitext, wikitext);

        if (replaceSomething) {
            toast('Делаем правку: \nОтправляем изменения...');
            let response = await fetchJson('/w/api.php', {
                errorMessage: 'Не удалось произвести правку',
                type: 'POST',
                data: {
                    format: 'json',
                    action: 'edit',
                    title: currentPageName,
                    minor: true,
                    text: wikitext,
                    summary: main.settings.editSummary,
                    basetimestamp: this.timestamp,
                    token: mw.user.tokens.get('editToken')
                }
            });
            if (!response.edit || response.edit.result !== 'Success') {
                console.log(response);
                toast('Не удалось произвести правку: ' + (response.edit ? response.edit.info : 'неизвестная ошибка'));
                return;
            }
            toast('Правка выполена');
        }
    }

    makeChangeEditMode() {
        toast('Применяем замены...');
        // https://stackoverflow.com/questions/46628426/are-textarea-properties-childnodes0-nodevalue-and-value-always-equal
        let textareaText = this.root.value;
        for (let replace of this.replaces) {
            textareaText = StringHelper.replaceWordAt(textareaText, replace.highlightInfo.wordStartIndex, replace.yoword);
        }
        StringHelper.assertNewStringIsYoficatedVersionOfOld(this.root.value, textareaText);
        this.root.value = textareaText;
        toast('Ёфикация завершена');
    }

    goToNextPage() {
        main.performContinuousYofication();
    }

    afterYofication() {
        if (!this.pageMode) {
            return;
        }
        if (main.continuousYofication)
            this.goToNextPage();
        else
            removeArgumentsFromUrl();
    }

    abortYofication() {
        if (!main.continuousYofication) {
            toast('Ёфикация отменена');
        }
        this.afterYofication();
    }

    openYowordWiktionaryPage() {
        const wordEndings = ['ая', 'ое', 'ой', 'ою', 'ом', 'ого', 'ому', 'ую', 'ый', 'ым', 'ых', 'ые', 'ыми'];
        let yoword = this.replaces[this.iReplace].yoword;
        for (let wordEnding of wordEndings) {
            if (yoword.endsWith(wordEnding)) {
                yoword = yoword.substring(0, yoword.length - wordEnding.length) + 'ый';
                break;
            }
        }
        let url = WIKTIONARY_URL + yoword;
        window.open(url);
    }
}
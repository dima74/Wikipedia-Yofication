import toast from './toast';
import {assert, fetchJson, removeArgumentsFromUrl} from './base';
import {main} from './main';
import {currentPageName} from './wikipedia-api';
import StringHelper from './string-helper';

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
            // this.wikitext = this.root.innerHTML;
            // this.wikitextPromise = Promise.resolve(this.wikitext/*.replace(/\r/g, '')*/);

            this.root.previousElementSibling.style.color = 'initial';
            // this.root.previousElementSibling.style.opacity = 0.99;
            // this.root.previousElementSibling.style.isolation = 'isolate';
            // this.root.previousElementSibling.style.zIndex = 1;
            this.root.previousElementSibling.style.position = 'relative';
            this.root.style.isolation = 'isolate';
            this.root.style.zIndex = 1;

            // this.highlightsWrapper = document.createElement('div');
            // this.highlightsWrapper.id = 'highlightsWrapper';
            // this.highlightsWrapper.style.isolation = 'isolate';
            // this.root.previousElementSibling.appendChild(this.highlightsWrapper);
            this.highlightsWrapper = this.root.previousElementSibling;

            this.fakeElement = document.createElement('div');
            this.fakeElement.id = 'fakeElement';
            this.fakeElement.innerHTML = this.root.innerHTML;
            this.fakeElement.style.cssText = this.root.style.cssText;
            this.fakeElement.style.fontFamily = 'monospace';
            this.fakeElement.style.tabSize = 4;
            this.fakeElement.style.visibility = 'hidden';
            this.fakeElement.style.whiteSpace = 'pre-wrap';
            this.root.parentElement.appendChild(this.fakeElement);
        }

        this.iReplace = -1;
        this.done = false;
    }

    async perform() {
        await this.loadReplaces();
        this.checkRevisionsMatch();
        if (this.pageMode) {
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

        if (this.replaces.length < main.settings.minimumNumberReplacesForContinuousYofication) {
            toast('assert: this.replaces.length < main.settings.minimumNumberReplacesForContinuousYofication');
            this.afterYofication();
            return;
        }

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
        let {yowordsToReplaces, revision, timestamp} = await main.backend.getReplaces(currentPageName);
        this.yowordsToReplaces = yowordsToReplaces;
        this.revision = revision;
        this.timestamp = timestamp;
        this.yowords = Object.keys(yowordsToReplaces);
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
        for (let yoword of this.yowords) {
            let yowordInfo = this.yowordsToReplaces[yoword];
            assert(yowordInfo.frequency >= main.settings.minReplaceFrequency);
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
        if (!this.pageMode) {
            progress.style.zIndex = 2;
        }
    }

    createHighlights() {
        let root = this.root;
        let filter = {
            acceptNode: (node) => {
                let visible = node.offsetParent !== null;
                return visible ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        };
        let walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL, filter);

        let yowordsInfos = {};
        for (let yoword of this.yowords) {
            yowordsInfos[yoword] = [];
        }

        let nodeOrderIndex = 0;
        while (walker.nextNode()) {
            let node = walker.currentNode;
            if (node.nodeType === 3) {
                let text = node.nodeValue;
                for (let yoword of this.yowords) {
                    let dword = StringHelper.deyoficate(yoword);
                    if (text.includes(dword)) {
                        let indexes = StringHelper.findIndexesOfWord(dword, text);
                        let occurrences = indexes.map(wordStartIndex => { return {wordStartIndex, wordNode: node, wordOrderIndex: [nodeOrderIndex, wordStartIndex]}; });
                        yowordsInfos[yoword].push(...occurrences);
                    }
                }
                ++nodeOrderIndex;
            }
        }

        for (let yoword of this.yowords) {
            let highlights = [];
            for (let occurrence of yowordsInfos[yoword]) {
                let wordNode = this.pageMode ? occurrence.wordNode : this.fakeElement.childNodes[0];
                let wordStartIndex = occurrence.wordStartIndex;

                let range = document.createRange();
                range.setStart(wordNode, wordStartIndex);
                range.setEnd(wordNode, wordStartIndex + yoword.length);

                let highlightElement = document.createElement('span');
                // https://stackoverflow.com/questions/46505758/why-offsetparent-returns-nearest-table-for-non-positioned-element
                highlightElement.style.position = 'absolute';
                if (this.pageMode) {
                    wordNode.before(highlightElement);
                    highlightElement.parentElement.style.isolation = 'isolate';
                    // верхней строчки недостаточно из-за бага в хроме
                    // https://stackoverflow.com/questions/46621884/different-behaviour-of-isolation-isolate-when-div-is-inside-table
                    highlightElement.parentElement.style.opacity = 0.99;
                } else {
                    this.highlightsWrapper.appendChild(highlightElement);
                }

                this.addProgressToHighlight(highlightElement, this.yowordsToReplaces[yoword].frequency);

                let recalcPosition = () => {
                    let rect = range.getBoundingClientRect();
                    let root = highlightElement.offsetParent;
                    let rootRect = root.getBoundingClientRect();

                    let padding = this.pageMode ? 0 : 2;
                    let left = rect.left - padding - (this.pageMode ? 0 : 1);
                    let top = rect.top - padding - (this.pageMode ? 0 : 1);
                    let width = rect.width + padding * 2;
                    let height = rect.height + padding * 2;
                    left -= rootRect.left;
                    top -= rootRect.top;
                    $(highlightElement).css({left, top, width, height});
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
                if (!this.pageMode || this.checkWordNode(wordNode, yoword)) {
                    highlights.push({wordNode, wordStartIndex, highlightElement, wordOrderIndex: occurrence.wordOrderIndex});
                }
            }
            this.yowordsToReplaces[yoword].highlights = highlights;
        }
    }

    checkWordNode(wordNode, yoword) {
        for (let element = wordNode; element !== this.root; element = element.parentElement) {
            if (element.nodeType === 1) {
                // цитаты, ссылки
                const ignoredTags = ['blockquote', 'a'];
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
                        const sectionsIgnored = ['литература', 'ссылки', 'примечания', 'сочинения', 'источники', 'труды'];
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
            const contextLength = 20;
            for (let highlight of yowordInfo.highlights) {
                let wordNodeValue = highlight.wordNode.nodeValue;
                let wordNodeStartIndex = highlight.wordStartIndex;
                let wordNodeEndIndex = highlight.wordStartIndex + yoword.length;
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
                let numberReplacesLocal = yowordInfo.highlights.length;
                let numberReplacesRemote = replaces.length;
                let singleLocalSingleRemote = numberReplacesLocal === 1 && numberReplacesRemote === 1;
                let multipleLocalSingleRemote = numberReplacesLocal > 1 && numberReplacesRemote === 1 && replaces[0].commonLength >= 20;
                let multipleRemote = numberReplacesRemote > 1 && replaces[0].commonLength >= 10 && replaces[0].commonLength > replaces[1].commonLength * 1.5;
                if (singleLocalSingleRemote || multipleLocalSingleRemote || multipleRemote) {
                    let replaceRemote = replaces[0];

                    let replace = {
                        yoword,
                        wordStartIndex: replaceRemote.replace.wordStartIndex,
                        frequency: yowordInfo.frequency,
                        highlightInfo: highlight,
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
                assert(false, 'checkSingleMatching');
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
            let numberLocal = yowordInfo.highlights.length;
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
            // ещё раз показать последнюю замену
            [this.showCurrentReplaceAgain, ';', 'ж'],
            // вернуться к предыдущей замене
            [this.goToPreviousReplace, 'a', 'ф'],
            // отменить ёфикация текущей страницы
            [this.abortYofication, 'q', 'й']
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
            this.makeChange();
            return true;
        }
        if (this.iReplace > this.replaces.length) {
            throw 'goToCurrentReplace: iReplace > replaces.length';
        }

        let replace = this.replaces[this.iReplace];
        let yoword = replace.yoword;
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
            }
        }
    }

    async makeChange() {
        if (this.visibleHighlight) {
            this.visibleHighlight.style.display = 'none';
        }

        this.done = true;
        this.replaces = this.replaces.filter(replace => replace.isAccept);
        if (this.replaces.length === 0) {
            toast('Ёфикация завершена\n(ни одна замена не была принята)');
            return;
        }

        if (this.pageMode) {
            await this.makeChangePageMode();
            this.afterYofication();
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
}
import toast from './toast';
import {assert, fetchJson, removeArgumentsFromUrl} from './base';
import {main} from './main';
import {currentPageName} from './wikipedia-api';
import StringHelper from './string-helper';

String.prototype.insert = function (i, s, numberCharsToReplace) {
    return this.substr(0, i) + s + this.substr(i + numberCharsToReplace);
};

export default class Yofication {
    constructor() {
        this.root = this.getRootElement();
        this.rootInner = this.root.childNodes[0];
        assert(this.rootInner.classList.contains('mw-parser-output'));
        this.iReplace = -1;
        this.done = false;
        this.wikitextPromise = main.wikipediaApi.getWikitext(currentPageName);
    }

    async perform() {
        await this.loadReplaces();
        await this.checkWikitextMatch();
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

        if (this.wikitext.length > 50000) {
            toast('temp: викитекст слишком большой');
            this.afterYofication();
            return;
        }

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
                    throw `викитекст страницы "${currentPageName}" не совпадает в индексе ${replace.wordStartIndex}`
                    + `\nожидается: ${dwordRemote}"`
                    + `\nполучено: "${dwordLocal}"`;
                }
            }
        }

        let revisionLocal = mw.config.get('wgCurRevisionId');
        if (this.revision !== revisionLocal) {
            throw `ревизии не совпадают\n локальная: ${revisionLocal} \nожидается: ${this.revision}`;
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
                        let occurrences = indexes.map(wordIndex => { return {wordIndex, wordNode: node, wordOrderIndex: [nodeOrderIndex, wordIndex]}; });
                        yowordsInfos[yoword].push(...occurrences);
                    }
                }
                ++nodeOrderIndex;
            }
        }

        for (let yoword of this.yowords) {
            let highlights = [];
            for (let occurrence of yowordsInfos[yoword]) {
                let wordNode = occurrence.wordNode;
                let wordIndex = occurrence.wordIndex;

                let range = document.createRange();
                range.setStart(wordNode, wordIndex);
                range.setEnd(wordNode, wordIndex + yoword.length);

                let highlightElement = document.createElement('span');
                // https://stackoverflow.com/questions/46505758/why-offsetparent-returns-nearest-table-for-non-positioned-element
                highlightElement.style.position = 'absolute';
                wordNode.before(highlightElement);
                highlightElement.parentElement.style.isolation = 'isolate';

                function recalcPosition() {
                    let rect = range.getBoundingClientRect();
                    let root = highlightElement.offsetParent;
                    let rootRect = root.getBoundingClientRect();

                    let padding = 0;
                    let left = rect.left - padding;
                    let top = rect.top - padding;
                    let width = rect.width + padding * 2;
                    let height = rect.height + padding * 2;
                    left -= rootRect.left;
                    top -= rootRect.top;
                    $(highlightElement).css({left, top, width, height});
                }

                // todo ask on SO is adding functions to HTMLElement instance allowed
                highlightElement.recalcPosition = recalcPosition;
                highlightElement.recalcPosition();

                $(highlightElement).css({
                    zIndex: -1,
                    background: 'aquamarine',
                    display: 'none'
                });
                if (this.checkWordNode(wordNode, yoword)) {
                    highlights.push({wordNode, wordIndex, highlightElement, wordOrderIndex: occurrence.wordOrderIndex});
                }
            }
            this.yowordsToReplaces[yoword].highlights = highlights;
        }
    }

    checkWordNode(wordNode, yoword) {
        return this.checkWordNodePartOne(wordNode, yoword)
            && this.checkWordNodePartTwo(wordNode, yoword);
    }

    // фильтрует вхождения, которые дублируют другое вхождение из викитекста
    // не находится внутри содержания и т.д.
    checkWordNodePartOne(wordNode, yoword) {
        for (let element = wordNode; element !== this.root; element = element.parentElement) {
            // содержание
            if (element.id === 'toc') {
                console.log(`ignore word "${yoword}" inside #toc`);
                return false;
            }

            // ссылки
            if (element.tagName === 'A') {
                console.log(`ignore word "${yoword}" inside <a>`);
                return false;
            }

            // цитаты из шаблона {{Quote}}
            let previousElement = element.previousElementSibling;
            if (element.nodeType === 1 && element.tagName === 'TD' && previousElement !== null && previousElement.tagName === 'TD' && previousElement.innerHTML.includes('quote1.png')) {
                console.log(`ignore word "${yoword}" inside quote`);
                return false;
            }
        }
        return true;
    }

    // фильтрует вхождения, которые однозначно соответствуют викитексту
    // не находится внутри blockquote, не находится в секции `литература` и т.д.
    checkWordNodePartTwo(wordNode, yoword) {
        for (let element = wordNode; element !== this.root; element = element.parentElement) {
            // цитаты
            if (element.tagName === 'BLOCKQUOTE') {
                console.log(`ignore word "${yoword}" inside <blockquote>`);
                return false;
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
        let lengthBefore = StringHelper.longestSuffix(contextBefore, replaceInfo.contextBefore);
        let lengthAfter = StringHelper.longestPrefix(contextAfter, replaceInfo.contextAfter);
        return lengthBefore + lengthAfter;
    }

    createReplaces() {
        let replacesLocal = [];
        for (let yoword of this.yowords) {
            let yowordInfo = this.yowordsToReplaces[yoword];

            const contextLength = 20;
            for (let highlight of yowordInfo.highlights) {
                let wordNodeValue = highlight.wordNode.nodeValue;
                let wordNodeStartIndex = highlight.wordIndex;
                let wordNodeEndIndex = highlight.wordIndex + yoword.length;
                let contextBefore = wordNodeValue.substring(Math.max(wordNodeStartIndex - contextLength, 0), wordNodeStartIndex);
                let contextAfter = wordNodeValue.substring(wordNodeEndIndex, Math.min(wordNodeEndIndex + contextLength, wordNodeValue.length));
                let replaces = yowordInfo.replaces
                    .map(replace => { return {replace, commonLength: this.getCommonLength(contextBefore, contextAfter, replace)}; })
                    .sort((replace1, replace2) => replace2.commonLength - replace1.commonLength);
                if (replaces.length === 1 || replaces[0].commonLength >= 10 && replaces[0].commonLength > replaces[1].commonLength * 2) {
                    let replaceRemote = replaces[0];

                    let replace = {
                        yoword,
                        wordStartIndex: replaceRemote.replace.wordStartIndex,
                        frequency: yowordInfo.frequency,
                        highlight,
                        isAccept: false
                    };
                    assert(replace.wordStartIndex !== undefined);
                    replacesLocal.push(replace);
                }
            }
        }
        const compareTwoElementArrays = (a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
        replacesLocal.sort((replace1, replace2) => compareTwoElementArrays(replace1.highlight.wordOrderIndex, replace2.highlight.wordOrderIndex));
        for (let replace of replacesLocal) {
            replace.highlight = replace.highlight.highlightElement;
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
            [this.afterYofication, 'q', 'й']
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
        let status = `${replace.frequency}%\n${yoword}\nЗамена ${this.iReplace + 1} из ${this.replaces.length}`;
        toast(status);

        if (this.visibleHighlight) {
            this.visibleHighlight.style.display = 'none';
        }
        replace.highlight.style.display = 'block';
        this.visibleHighlight = replace.highlight;
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
            let y = (window.scrollY + highlightRect.top) - (window.innerHeight - highlightRect.height) / 2;
            window.scrollTo(0, y);
        }
    }

    async makeChange() {
        this.done = true;
        let replacesRight = this.replaces.filter(replace => replace.isAccept);
        if (replacesRight.length === 0) {
            toast('Ни одна замена не была принята');
            return;
        }

        let wikitext = this.wikitext;
        toast('Делаем правку: \nПрименяем замены...');
        let replaceSomething = false;
        for (let i = 0; i < replacesRight.length; ++i) {
            let replace = replacesRight[i];
            let yoword = replace.yoword;
            // todo
            assert(replace.wordStartIndex !== undefined);
            assert(yoword !== undefined);
            wikitext = wikitext.insert(replace.wordStartIndex, yoword, yoword.length);
            replaceSomething = true;
        }
        assert(wikitext.length === this.wikitext.length);
        for (let i = 0; i < wikitext.length; ++i) {
            let charNew = wikitext[i];
            let charOld = this.wikitext[i];
            assert(charNew === charOld
                || charOld === 'е' && charNew === 'ё'
                || charOld === 'Е' && charNew === 'Ё');
        }

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

    goToNextPage() {
        main.performContinuousYofication();
    }

    afterYofication() {
        if (main.continuousYofication)
            this.goToNextPage();
        else
            removeArgumentsFromUrl();
    }
}
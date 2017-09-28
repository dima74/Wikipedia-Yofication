import toast from './toast';
import {assert, fetchJson, removeArgumentsFromUrl} from './base';
import {main} from './main';
import {currentPageName} from './wikipedia-api';
import StringHelper from './string-helper';

String.prototype.insert = function (i, s, numberCharsToReplace) {
    return this.substr(0, i) + s + this.substr(i + numberCharsToReplace);
};

export default class Yofication {
    constructor(continuousYofication) {
        this.continuousYofication = continuousYofication;
        this.textDiv = this.getTextDiv();
        this.text = this.textDiv.html();
        this.iReplace = -1;
        this.done = false;
        this.wikitextPromise = main.wikipediaApi.getWikitext(currentPageName);
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
            throw `revision doesn't match\n local: ${revisionLocal} \nremote: ${this.revision}`;
        }
    }

    createHighlights() {
        let element = document.getElementById('mw-content-text');
        let walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

        let yowordsInfos = {};
        for (let yoword of this.yowords) {
            yowordsInfos[yoword] = [];
        }

        let indexOfOccurence = 0;
        while (walker.nextNode()) {
            let node = walker.currentNode;
            let text = node.nodeValue;
            for (let yoword of this.yowords) {
                let dword = StringHelper.deyoficate(yoword);
                if (text.includes(dword)) {
                    let indexes = StringHelper.findIndexesOfWord(dword, text);
                    let occurrences = indexes.map(wordIndex => { return {wordIndex, node, index: indexOfOccurence++}; });
                    yowordsInfos[yoword].push(...occurrences);
                }
            }
        }

        for (let yoword of this.yowords) {
            let highlights = [];
            for (let occurrence of yowordsInfos[yoword]) {
                let node = occurrence.node;
                let wordIndex = occurrence.wordIndex;

                let range = document.createRange();
                range.setStart(node, wordIndex);
                range.setEnd(node, wordIndex + yoword.length);
                let rect = range.getBoundingClientRect();

                let highlight = document.createElement('span');
                node.parentElement.appendChild(highlight);

                let root = highlight.offsetParent;
                let rootRect = root.getBoundingClientRect();

                let padding = 0;
                let left = rect.left - padding;
                let top = rect.top - padding;
                let width = rect.width + padding * 2;
                let height = rect.height + padding * 2;
                left -= rootRect.left;
                top -= rootRect.top;
                $(highlight).css({
                    position: 'absolute',
                    left, top, width, height,
                    zIndex: -1,
                    background: 'aquamarine',
                    display: 'none'
                });
                highlights.push({element: highlight, index: occurrence.index});
            }
            this.yowordsToReplaces[yoword].highlights = highlights;
        }
    }

    createReplaces() {
        let replaces = [];
        for (let yoword of this.yowords) {
            let yowordInfo = this.yowordsToReplaces[yoword];
            if (yowordInfo.numberSameDwords === yowordInfo.highlights.length) {
                for (let replaceInfo of yowordInfo.replaces) {
                    let replace = {
                        yoword,
                        frequency: yowordInfo.frequency,
                        highlight: yowordInfo.highlights[replaceInfo.numberSameDwordsBefore],
                        isAccept: false
                    };
                    replaces.push(replace);
                }
            } else {
                console.log(`
${yoword}
Предупреждение: не совпадает numberSameDwords
Найдено: ${yowordInfo.highlights.length}
Должно быть: ${yowordInfo.numberSameDwords}`);
                // todo
                assert(false);
            }
        }
        replaces.sort((replace1, replace2) => replace1.highlight.index - replace2.highlight.index);
        for (let replace of replaces) {
            replace.highlight = replace.highlight.element;
        }
        this.replaces = replaces;
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
            toast('todo');
            this.afterYofication();
            return;
        }

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

    checkIReplace() {
        return 0 <= this.iReplace && this.iReplace < this.replaces.length;
    }

    hideCurrentReplace() {
        if (this.checkIReplace()) {
            this.replaces[this.iReplace].highlight.style.display = 'none';
        }
    }

    goToNextReplace() {
        this.hideCurrentReplace();
        assert(this.iReplace !== this.replaces.length);
        do {
            ++this.iReplace;
        } while (!this.goToCurrentReplace());
    }

    goToPreviousReplace() {
        this.hideCurrentReplace();
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
            this.textDiv.html(this.text);
            (async () => {
                await this.makeChange();
                this.afterYofication();
            })();
            return true;
        }
        if (this.iReplace > this.replaces.length) {
            throw 'goToCurrentReplace: iReplace > replaces.length';
        }

        let replace = this.replaces[this.iReplace];
        let yoword = replace.yoword;
        let status = `Замена ${this.iReplace + 1} из ${this.replaces.length}\n${yoword}\nЧастота: ${replace.frequency}%`;
        toast(status);

        replace.highlight.style.display = 'block';
        this.scrollToReplace();
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
        this.scrollToReplace();
    }

    scrollToReplace() {
        if (this.checkIReplace()) {
            let highlight = this.replaces[this.iReplace].highlight;
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
            wikitext = wikitext.insert(replace.wordStartIndex, yoword, yoword.length);
            replaceSomething = true;
        }

        if (replaceSomething) {
            toast('Делаем правку: \nОтправляем изменения...');
            throw 1;
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
                toast('Не удалось произвести правку: ' + (data.edit ? data.edit.info : 'неизвестная ошибка'));
                return;
            }
            toast('Правка выполена');
        }
    }

    goToNextPage() {
        main.performContinuousYofication();
    }

    afterYofication() {
        if (this.continuousYofication)
            this.goToNextPage();
        else
            removeArgumentsFromUrl();
    }
}
import BaseYoficator, { getReplaceHintColor } from './BaseYoficator';
import wikipediaApi, { currentPageName } from '../wikipedia-api';
import toast from '../toast';
import backend from '../backend';
import { assert, fetchJson, sleep } from '../base';
import { addConvientPropertiesToReplaces, checkReplacesMatchWikitext, isNewWikitextYoficatedVersionOfOld } from './utility';
import StringHelper from '../string-helper';
import settings from '../settings';

export default class PageYoficator extends BaseYoficator {
    async init() {
        this.isPageMode = true;
        this.root = $('#mw-content-text')[0];
        this.rootInner = $('.mw-parser-output')[0];

        await this.loadReplacesAndWikitext();
        this.groupReplacesByYoword();
        this.createHighlights();
        this.createReplaces();
    }

    async loadReplacesAndWikitext() {
        const wikitextPromise = wikipediaApi.getWikitext(currentPageName);

        toast('Загружаем список замен...');
        const { replaces, revision, timestamp, wikitextLength } = await backend.getReplacesByPageName(currentPageName);
        this.replaces = replaces;
        this.timestamp = timestamp;
        if (replaces.length === 0) return;

        toast('Загружаем викитекст...');
        this.wikitext = await wikitextPromise;

        assert(revision === mw.config.get('wgCurRevisionId'));
        assert(this.wikitext.length === wikitextLength);
        checkReplacesMatchWikitext(this.wikitext, replaces);
        addConvientPropertiesToReplaces(this.wikitext, replaces);
    }

    groupReplacesByYoword() {
        const yowordsRepeated = this.replaces.map(replace => replace.yoword);
        this.yowords = [...new Set(yowordsRepeated)];

        this.yowordsToReplaces = {};
        for (const yoword of this.yowords) {
            this.yowordsToReplaces[yoword] = { replaces: [] };
        }
        for (const replace of this.replaces) {
            const contextLength = 30;
            replace.contextBefore = this.wikitext.substring(replace.wordStartIndex - contextLength, replace.wordStartIndex);
            replace.contextAfter = this.wikitext.substring(replace.wordEndIndex, replace.wordEndIndex + contextLength);

            const yowordInfo = this.yowordsToReplaces[replace.yoword];
            yowordInfo.replaces.push(replace);
            yowordInfo.frequency = replace.frequency;
        }
    }

    createHighlights() {
        const yowordsInfos = {};
        for (const yoword of this.yowords) {
            yowordsInfos[yoword] = [];
        }

        let nodeOrderIndex = 0;
        const processTextNode = (node, nodeValue) => {
            for (const yoword of this.yowords) {
                const eword = StringHelper.deyoficate(yoword);
                if (nodeValue.includes(eword)) {
                    const indexes = StringHelper.findIndexesOfWord(eword, nodeValue);
                    const occurrences = indexes.map(wordStartIndex => ({ wordStartIndex, wordNode: node, wordNodeValue: nodeValue, wordOrderIndex: [nodeOrderIndex, wordStartIndex] }));
                    yowordsInfos[yoword].push(...occurrences);
                }
            }
            ++nodeOrderIndex;
        };

        const filter = {
            acceptNode: (node) => {
                const visible = node.offsetParent !== null;
                return visible ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            },
        };
        const walker = document.createTreeWalker(this.root, NodeFilter.SHOW_ALL, filter);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeType === 3) {
                processTextNode(node, node.nodeValue);
            }
        }

        for (const yoword of this.yowords) {
            const occurrences = [];
            for (const occurrence of yowordsInfos[yoword]) {
                const range = document.createRange();
                range.setStart(occurrence.wordNode, occurrence.wordStartIndex);
                range.setEnd(occurrence.wordNode, occurrence.wordStartIndex + yoword.length);

                // todo refactor to use createReplaceElement
                const highlightElement = document.createElement('span');
                // https://stackoverflow.com/questions/46505758/why-offsetparent-returns-nearest-table-for-non-positioned-element
                highlightElement.style.position = 'absolute';
                occurrence.wordNode.before(highlightElement);
                highlightElement.parentElement.style.isolation = 'isolate';
                // верхней строчки недостаточно из-за бага в хроме
                // https://stackoverflow.com/questions/46621884/different-behaviour-of-isolation-isolate-when-div-is-inside-table
                highlightElement.parentElement.style.opacity = '0.99';

                this.addProgressToHighlight(highlightElement, this.yowordsToReplaces[yoword].frequency);

                const recalcPosition = () => {
                    const rect = range.getBoundingClientRect();
                    const root = highlightElement.offsetParent;
                    const rootRect = root.getBoundingClientRect();

                    const padding = 2;
                    const left = rect.left - rootRect.left - padding;
                    const top = rect.top - rootRect.top - padding;
                    const width = rect.width + padding * 2;
                    const height = rect.height + padding * 2;
                    $(highlightElement).css({ left, top, width, height });
                };

                // todo ask on SO is adding functions to HTMLElement instance allowed
                highlightElement.recalcPosition = recalcPosition;
                highlightElement.recalcPosition();

                $(highlightElement).css({
                    background: 'aquamarine',
                    display: 'none',
                    zIndex: -1,
                });

                if (this.checkWordNode(occurrence.wordNode, yoword)) {
                    occurrence.highlightElement = highlightElement;
                    occurrences.push(occurrence);
                }
            }
            this.yowordsToReplaces[yoword].occurrences = occurrences;
        }
    }

    addProgressToHighlight(highlightElement, frequencyPercent) {
        const progress = document.createElement('span');
        highlightElement.appendChild(progress);
        const progressHeight = 5;
        $(progress).css({
            width: `${frequencyPercent}%`,
            backgroundColor: getReplaceHintColor(frequencyPercent),
            content: '',
            height: `${progressHeight}px`,
            position: 'absolute',
            left: '0',
            top: `-${progressHeight}px`,
        });
    }

    checkWordNode(wordNode, yoword) {
        for (let element = wordNode; element !== this.root; element = element.parentElement) {
            if (element.nodeType === 1) {
                // цитаты, ссылки
                const ignoredTags = ['blockquote', 'a', 'pre', 'i'];
                for (const ignoredTag of ignoredTags) {
                    if (element.tagName.toLowerCase() === ignoredTag) {
                        console.log(`ignore word "${yoword}" inside <${ignoredTag}>`);
                        return false;
                    }
                }

                // поэмы
                const ignoredClasses = ['poem'];
                for (const ignoredClass of ignoredClasses) {
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
                const previousElement = element.previousElementSibling;
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
                        const latestSectionName = (previousElement.innerText || '').toLowerCase();
                        const sectionsIgnored = ['литература', 'ссылки', 'примечания', 'сочинения', 'источники', 'труды'];
                        for (const section of sectionsIgnored) {
                            if (latestSectionName.includes(section)) {
                                console.log(`ignore word "${yoword}" in section "${latestSectionName}"`);
                                return false;
                            }
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
        const lengthBefore = StringHelper.longestSuffix(contextBefore, replaceInfo.contextBefore);
        const lengthAfter = StringHelper.longestPrefix(contextAfter, replaceInfo.contextAfter);
        return lengthBefore + lengthAfter;
    }

    createReplaces() {
        const replacesLocal = [];
        for (const yoword of this.yowords) {
            const yowordInfo = this.yowordsToReplaces[yoword];

            const yowordReplaces = [];
            const contextLength = 30;
            for (const occurrence of yowordInfo.occurrences) {
                const wordNodeValue = occurrence.wordNodeValue;
                const wordNodeStartIndex = occurrence.wordStartIndex;
                const wordNodeEndIndex = occurrence.wordStartIndex + yoword.length;
                const contextBefore = wordNodeValue.substring(Math.max(wordNodeStartIndex - contextLength, 0), wordNodeStartIndex);
                const contextAfter = wordNodeValue.substring(wordNodeEndIndex, Math.min(wordNodeEndIndex + contextLength, wordNodeValue.length));
                // перед сортировкой обязательно нужно создать копию массива
                // сейчас копию создаётся в процессе `map`
                const replaces = yowordInfo.replaces
                    .map(replace => ({ replace, commonLength: this.getCommonLength(contextBefore, contextAfter, replace) }))
                    .sort((replace1, replace2) => replace2.commonLength - replace1.commonLength);
                // найденное число вхождений, ожидаемое число вхождений, результат
                //  1,  1, сопоставляем
                // >1,  1, выбираем из найденных замен лучшую подходящую
                //  1, >1, подбираем для найденной замены лучшую ожидаемую
                // >1, >1, по контексту
                const numberReplacesLocal = yowordInfo.occurrences.length;
                const numberReplacesRemote = replaces.length;
                const singleLocalSingleRemote = numberReplacesLocal === 1 && numberReplacesRemote === 1 && replaces[0].commonLength >= 10;
                const multipleLocalSingleRemote = numberReplacesLocal > 1 && numberReplacesRemote === 1 && replaces[0].commonLength >= 20;
                const multipleRemote = numberReplacesRemote > 1 && replaces[0].commonLength >= 10 && replaces[0].commonLength > replaces[1].commonLength * 1.5;
                if (singleLocalSingleRemote || multipleLocalSingleRemote || multipleRemote) {
                    const replaceRemote = replaces[0];

                    const replace = {
                        yoword,
                        wordStartIndex: replaceRemote.replace.wordStartIndex,
                        frequency: yowordInfo.frequency,
                        highlightInfo: occurrence,
                        isAccept: false,
                    };
                    assert(replace.wordStartIndex !== undefined, 'replace.wordStartIndex !== undefined');

                    const indexRemote = yowordInfo.replaces.indexOf(replaceRemote.replace);
                    assert(indexRemote !== -1, 'indexRemote === -1');
                    yowordReplaces.push({ replace, indexRemote });
                }
            }

            const indexesRemote = yowordReplaces.map(replace => replace.indexRemote);
            const checkSingleMatching = (new Set(indexesRemote)).size === indexesRemote.length;
            if (checkSingleMatching) {
                for (const { replace, indexRemote } of yowordReplaces) {
                    replacesLocal.push(replace);
                }
            } else {
                console.error(`${yoword}\nНесколько локальных вхождений были сопоставлены одному remote\n${indexesRemote}`);
                // assert(false, 'checkSingleMatching');
            }
        }
        const compareTwoElementArrays = (a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
        replacesLocal.sort((replace1, replace2) => compareTwoElementArrays(replace1.highlightInfo.wordOrderIndex, replace2.highlightInfo.wordOrderIndex));
        for (const replace of replacesLocal) {
            replace.highlightElement = replace.highlightInfo.highlightElement;
        }

        // статистика сопоставления замен
        console.log('');
        console.log(`${'yoword'.padEnd(20 - 'local'.length + 1)} local:remote => associated`);
        for (const yoword of this.yowords) {
            const yowordInfo = this.yowordsToReplaces[yoword];
            const numberLocal = yowordInfo.occurrences.length;
            const numberRemote = yowordInfo.replaces.length;
            const numberAssociated = replacesLocal.filter(replace => replace.yoword === yoword).length;
            console.log(`${yoword.padEnd(20)} ${numberLocal}:${numberRemote} => ${numberAssociated}`);
        }
        console.log('');

        this.replaces = replacesLocal;
    }

    toggleReplaceVisible(replace, isVisible) {
        replace.highlightElement.style.display = isVisible ? 'block' : 'none';
        if (!isVisible) return;

        const highlight = replace.highlightElement;
        highlight.recalcPosition();
        const highlightRect = highlight.getBoundingClientRect();
        const y = (window.scrollY + highlightRect.top) - (window.innerHeight - highlightRect.height) / 2;
        window.scrollTo(0, y);
    }

    async cleanUp() {
        await super.cleanUp();

        // remove arguments from url
        window.history.pushState('', '', window.location.href.replace('?yofication', ''));
    }

    async onYoficationEnd() {
        this.replaces = this.replaces.filter(replace => replace.isAccept);
        if (this.replaces.length === 0) return;

        toast('Делаем правку: \nПрименяем замены...');
        await sleep(0);
        let wikitext = this.wikitext;
        for (const replace of this.replaces) {
            const yoword = replace.yoword;
            // todo
            assert(replace.wordStartIndex !== undefined);
            assert(yoword !== undefined);
            wikitext = wikitext.substr(0, replace.wordStartIndex) + yoword + wikitext.substr(replace.wordStartIndex + yoword.length);
        }
        assert(isNewWikitextYoficatedVersionOfOld(this.wikitext, wikitext));

        toast('Делаем правку: \nОтправляем изменения...');
        const response = await fetchJson('/w/api.php', {
            errorMessage: 'Не удалось произвести правку',
            type: 'POST',
            data: {
                format: 'json',
                action: 'edit',
                title: currentPageName,
                minor: true,
                text: wikitext,
                summary: settings.editSummary,
                basetimestamp: this.timestamp,
                token: mw.user.tokens.get('editToken'),
            },
        });
        if (!response.edit || response.edit.result !== 'Success') {
            console.log(response);
            assert(false, 'Не удалось произвести правку: ' + (response.edit ? response.edit.info : 'неизвестная ошибка'));
        }
    }
}

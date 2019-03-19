import BaseYoficator, { getReplaceHintColor } from './BaseYoficator';
import toast from '../toast';
import backend from '../backend';
import main from '../main';
import { addConvientPropertiesToReplaces, checkReplacesMatchWikitext, isNewWikitextYoficatedVersionOfOld } from './utility';

export default class WikitextBaseYoficator extends BaseYoficator {
    async fetchReplaces() {
        this.wikitext = this.getWikitext();

        if (main.isContinuousYofication && this.isPageEditingByAnotherUser()) return [];

        toast('Загружаем список замен...');
        const replaces = await backend.getReplacesByWikitext(this.wikitext);
        checkReplacesMatchWikitext(this.wikitext, replaces);
        addConvientPropertiesToReplaces(this.wikitext, replaces);
        this.markReplacesInsideQuotes(this.wikitext, replaces);
        return replaces;
    }

    markReplacesInsideQuotes(wikitext, replaces) {
        const QUOTES_DISTANCE_THRESHOLD = 7;

        for (const replace of replaces) {
            const quoteOpenIndex = wikitext.lastIndexOf('«', replace.wordStartIndex);
            if (quoteOpenIndex === -1) continue;

            const quoteCloseIndex = wikitext.indexOf('»', quoteOpenIndex);
            if (quoteCloseIndex === -1) continue;

            if (replace.wordStartIndex < quoteCloseIndex) {
                const distanceLeft = replace.wordStartIndex - quoteOpenIndex;
                const distanceRight = quoteCloseIndex - replace.wordEndIndex + 1;
                replace.isInsideQuotes = distanceLeft > QUOTES_DISTANCE_THRESHOLD && distanceRight > QUOTES_DISTANCE_THRESHOLD;
            }
        }
    }

    createReplaceElement(replace) {
        const element = document.createElement('span');
        element.classList.add('yoficator-replace');
        if (replace.isInsideQuotes) element.classList.add('yoficator-replace-inside-quotes');
        element.style.setProperty('--frequency-hint-width', replace.frequency + '%');
        element.style.setProperty('--frequency-hint-color', getReplaceHintColor(replace.frequencyWikipedia));
        element.textContent = replace.originalWord;
        return element;
    }

    async onYoficationEnd() {
        const wikitextNew = this.getWikitext();
        if (!isNewWikitextYoficatedVersionOfOld(this.wikitext, wikitextNew)) {
            console.warn('Итоговый викитекст отличается от исходного не только из-за ёфикации. Это ошибка если во время ёфикации викитекст не редактировался.');
        }
    }

    isPageEditingByAnotherUser() {
        const wikitext = this.wikitext.toLowerCase();
        const templateNames = ['редактирую', 'редактирую раздел', 'пишу', 'правлю', 'перерабатываю', 'перевожу', 'статья редактируется', 'викифицирую', 'inuse', 'inuse-by', 'processing'];
        return templateNames.some(name => wikitext.includes(`{{${name}`));
    }
}

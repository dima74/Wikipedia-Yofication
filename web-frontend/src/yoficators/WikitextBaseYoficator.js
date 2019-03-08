import BaseYoficator, { getReplaceHintColor } from './BaseYoficator';
import toast from '../toast';
import backend from '../backend';
import { assert } from '../base';
import { checkReplacesMatchWikitext, isNewWikitextYoficatedVersionOfOld } from './utility';

export default class WikitextBaseYoficator extends BaseYoficator {
    async fetchReplaces() {
        this.wikitext = this.getWikitext();

        toast('Загружаем список замен...');
        const { replaces, wikitextLength } = await backend.getReplacesByWikitext(this.wikitext);
        assert(this.wikitext.length === wikitextLength);
        checkReplacesMatchWikitext(this.wikitext, replaces);
        for (const replace of replaces) {
            const { wordStartIndex, yoword } = replace;
            replace.wordEndIndex = wordStartIndex + yoword.length;
            replace.originalWord = this.wikitext.substr(wordStartIndex, yoword.length);
        }
        return replaces;
    }

    createReplaceElement(replace) {
        const element = document.createElement('span');
        element.classList.add('yoficator-replace');
        element.style.setProperty('--frequency-hint-width', replace.frequency + '%');
        element.style.setProperty('--frequency-hint-color', getReplaceHintColor(replace.frequency));
        element.textContent = replace.originalWord;
        return element;
    }

    async onYoficationEnd() {
        const wikitextNew = this.getWikitext();
        if (!isNewWikitextYoficatedVersionOfOld(this.wikitext, wikitextNew)) {
            console.warn('Итоговый викитекст отличается от исходного не только из-за ёфикации. Это ошибка если во время ёфикации викитекст не редактировался.');
            // todo remove alert
            alert('!isNewWikitextYoficatedVersionOfOld');
        }
    }
}

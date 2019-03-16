import BaseYoficator, { getReplaceHintColor } from './BaseYoficator';
import toast from '../toast';
import backend from '../backend';
import main from '../main';
import { assert } from '../base';
import { addConvientPropertiesToReplaces, checkReplacesMatchWikitext, isNewWikitextYoficatedVersionOfOld } from './utility';

export default class WikitextBaseYoficator extends BaseYoficator {
    async fetchReplaces() {
        this.wikitext = this.getWikitext();

        if (main.isContinuousYofication && this.isPageEditingByAnotherUser()) return [];

        toast('Загружаем список замен...');
        const { replaces, wikitextLength } = await backend.getReplacesByWikitext(this.wikitext);
        assert(this.wikitext.length === wikitextLength);
        checkReplacesMatchWikitext(this.wikitext, replaces);
        addConvientPropertiesToReplaces(this.wikitext, replaces);
        return replaces;
    }

    createReplaceElement(replace) {
        const element = document.createElement('span');
        element.classList.add('yoficator-replace');
        const frequencyHintWidth = replace.isSafe ? 100 : replace.frequency;
        element.style.setProperty('--frequency-hint-width', frequencyHintWidth + '%');
        element.style.setProperty('--frequency-hint-color', getReplaceHintColor(replace.frequency));
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

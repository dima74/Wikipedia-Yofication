import { assert } from '../base';

export function deyoficate(yoword) {
    return yoword.replace(/ё/g, 'е').replace(/Ё/g, 'Е');
}

export function checkReplacesMatchWikitext(wikitext, replaces) {
    for (const replace of replaces) {
        const yoword = replace.yoword;
        const ewordRemote = deyoficate(yoword);
        const ewordLocal = wikitext.substr(replace.wordStartIndex, yoword.length);
        assert(ewordLocal === ewordRemote);
    }
}

export function addConvientPropertiesToReplaces(wikitext, replaces) {
    for (const replace of replaces) {
        const { wordStartIndex, yoword } = replace;
        replace.wordEndIndex = wordStartIndex + yoword.length;
        replace.originalWord = wikitext.substr(wordStartIndex, yoword.length);
    }
}

export function isNewWikitextYoficatedVersionOfOld(wikitextOld, wikitextNew) {
    if (wikitextOld.length !== wikitextNew.length) return false;
    for (let i = 0; i < wikitextOld.length; ++i) {
        const charOld = wikitextOld[i];
        const charNew = wikitextNew[i];
        const ok = charOld === charNew
            || charOld === 'е' && charNew === 'ё'
            || charOld === 'Е' && charNew === 'Ё';
        if (!ok) return false;
    }
    return true;
}

export function copyCssProperties(targetElement, referenceElement, properties) {
    const styles = window.getComputedStyle(referenceElement);
    for (const property of properties) {
        targetElement.style[property] = styles[property];
    }
}

export function copyFontCssProperties(targetElement, referenceElement) {
    const fontProperties = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing'];
    copyCssProperties(targetElement, referenceElement, fontProperties);
}

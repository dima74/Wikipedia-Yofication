import StringHelper from '../string-helper';
import { assert } from '../base';

export function checkReplacesMatchWikitext(wikitext, replaces) {
    for (const replace of replaces) {
        const yoword = replace.yoword;
        const ewordRemote = StringHelper.deyoficate(yoword);
        const ewordLocal = wikitext.substr(replace.wordStartIndex, yoword.length);
        assert(ewordLocal === ewordRemote);
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

export function copyFontCssProperties(highlightElement, referenceElement) {
    const properties = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
    const styles = window.getComputedStyle(referenceElement);
    for (const property of properties) {
        highlightElement.style[property] = styles[property];
    }
}

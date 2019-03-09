import WikitextBaseYoficator from './WikitextBaseYoficator';
import { copyCssProperties, copyFontCssProperties } from './utility';
import { assert } from '../base';

export default class TextAreaYoficator extends WikitextBaseYoficator {
    async init() {
        await $.when(mw.loader.using(['ext.wikiEditor']), $.ready);

        this.textarea = document.getElementById('wpTextbox1');
        this.replaces = await super.fetchReplaces();
        if (this.replaces.length === 0) return;

        this.editor = document.createElement('div');
        this.editor.setAttribute('contenteditable', 'true');
        this.editor.textContent = this.wikitext;
        this.editor.style.whiteSpace = 'pre-wrap';
        this.editor.style.overflowY = 'auto';
        this.editor.style.outline = 'none';
        copyFontCssProperties(this.editor, this.textarea);
        copyCssProperties(this.editor, this.textarea, ['height', 'color', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'tab-size']);

        const rootNode = this.editor.firstChild;
        // проверка что замены с сервера приходят отсортированные по индексу
        assert(this.replaces.every((replace, i) => i === 0 || this.replaces[i - 1].wordStartIndex < this.replaces[i].wordStartIndex));
        for (const replace of [...this.replaces].reverse()) {
            const wordNode = rootNode.splitText(replace.wordStartIndex);
            wordNode.splitText(replace.yoword.length);

            replace.element = super.createReplaceElement(replace);
            this.editor.replaceChild(replace.element, wordNode);
        }

        this.textarea.style.display = 'none';
        this.textarea.parentElement.insertBefore(this.editor, null);
    }

    getWikitext() {
        return this.textarea.value;
    }

    toggleReplaceVisible(replace, isVisible) {
        replace.element.classList.toggle('yoficator-replace-active', isVisible);
    }

    focusOnReplace(replace) {
        // scroll into view
        const editorRect = this.editor.getBoundingClientRect();
        const replaceRect = replace.element.getBoundingClientRect();
        const editorHeight = editorRect.bottom - editorRect.top;
        const replaceHeight = replaceRect.bottom - replaceRect.top;
        this.editor.scrollTop += replaceRect.top - editorRect.top - (editorHeight - replaceHeight) / 2;

        // move cursor
        const range = new Range();
        range.setStartAfter(replace.element);
        range.setEndAfter(replace.element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    toggleReplaceAccept(replace, isAccept) {
        replace.element.textContent = isAccept ? replace.yoword : replace.originalWord;
    }

    async cleanUp() {
        await super.cleanUp();
        this.textarea.value = this.editor.textContent;
        this.editor.remove();
        this.textarea.style.display = null;
    }
}

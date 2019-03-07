import toast from '../toast';
import { assert, sleep } from '../base';
import WikitextBaseYoficator from './WikitextBaseYoficator';

/* 2px = padding */
const styles = `
.yoficator-replace {
	display: inline-block;
	margin: -2px;
	padding: 2px;
}
`;

export default class CodeMirrorYoficator extends WikitextBaseYoficator {
    get styles() {
        return super.styles + styles;
    }

    async init() {
        if ($('.CodeMirror').length === 0) {
            await new Promise(resolve => $('#wpTextbox1').on('wikiEditor-toolbar-doneInitialSections', resolve));
        }

        assert($('.CodeMirror').length > 0);
        this.cm = $('.CodeMirror')[0].CodeMirror;
        this.replaces = await super.fetchReplaces(this.wikitext);

        toast('Обрабатываем замены...');
        await sleep(0);
        for (const replace of this.replaces) {
            replace.element = super.createReplaceElement(replace);

            const wordStartPos = this.cm.posFromIndex(replace.wordStartIndex);
            const wordEndPos = this.cm.posFromIndex(replace.wordEndIndex);
            const markTextOptions = { atomic: true, replacedWith: replace.element, inclusiveLeft: false, inclusiveRight: false };
            replace.cmMarker = this.cm.markText(wordStartPos, wordEndPos, markTextOptions);
        }
    }

    getWikitext() {
        return this.cm.getValue();
    }

    toggleReplaceVisible(replace, isVisible) {
        replace.element.classList.toggle('yoficator-replace-active', isVisible);

        // scroll into view
        const wordStartPos = this.cm.posFromIndex(replace.wordStartIndex);
        const wordEndPos = this.cm.posFromIndex(replace.wordEndIndex - 1);
        const wordX = (this.cm.charCoords(wordStartPos, 'local').top + this.cm.charCoords(wordEndPos, 'local').bottom) / 2;
        const editorHeight = this.cm.getScrollerElement().clientHeight;
        this.cm.scrollTo(null, wordX - editorHeight / 2);

        // move cursor
        if (isVisible) {
            this.cm.focus();
            this.cm.setCursor(wordEndPos, { bias: +1 });
        }
    }

    toggleReplaceAccept(replace, isAccept) {
        replace.element.textContent = isAccept ? replace.yoword : replace.originalWord;
    }

    async onYoficationEnd(forceNoEdit) {
        if (!forceNoEdit) toast('Завершаем ёфикацию...');
        await sleep(0);
        for (const replace of this.replaces) {
            const { from, to } = replace.cmMarker.find();
            this.cm.replaceRange(replace.element.textContent, from, to);
            replace.cmMarker.clear();
        }

        await super.onYoficationEnd(forceNoEdit);
    }
}

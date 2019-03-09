import toast from '../toast';
import { assert, sleep } from '../base';
import WikitextBaseYoficator from './WikitextBaseYoficator';
import main from '../main';
import createOverlay from './mobileOverlay';

export default class CodeMirrorYoficator extends WikitextBaseYoficator {
    async init() {
        if (main.isMobile) {
            $('#mw-panel, #mw-head, #mw-page-base').remove();
            $('#content').css({ margin: 0 });
            $('<meta name="viewport" content="user-scalable=no, width=device-width, height=device-height, initial-scale=1" />').appendTo(document.head);

            this.removeOverlay = createOverlay(
                this.abortYofication.bind(this),
                this.acceptReplace.bind(this),
                this.rejectReplace.bind(this),
            );
        }

        if ($('.CodeMirror').length === 0) {
            toast('Ожидаем завершения загрузки редактора...');
            await new Promise(resolve => $('#wpTextbox1').on('wikiEditor-toolbar-doneInitialSections', resolve));
        }

        assert($('.CodeMirror').length > 0);
        this.cm = $('.CodeMirror')[0].CodeMirror;
        this.replaces = await super.fetchReplaces();
        if (this.replaces.length === 0) return;

        toast('Обрабатываем замены...');
        await sleep(0);
        for (const replace of this.replaces) {
            replace.element = super.createReplaceElement(replace);

            const wordStartPos = this.cm.posFromIndex(replace.wordStartIndex);
            const wordEndPos = this.cm.posFromIndex(replace.wordEndIndex);
            const markTextOptions = { atomic: true, replacedWith: replace.element, inclusiveLeft: false, inclusiveRight: false };
            replace.cmMarker = this.cm.markText(wordStartPos, wordEndPos, markTextOptions);
        }

        const editor = this.cm.getScrollerElement();
        this.editorHeight = editor.clientHeight;
        if (main.isContinuousYofication) {
            const editorRect = editor.getBoundingClientRect();
            const y = main.isMobile ? (editorRect.top - 3) : (editorRect.top + editorRect.bottom) / 2 - window.innerHeight / 2;
            window.scrollBy(0, y);
        }
    }

    getWikitext() {
        return this.cm.getValue();
    }

    toggleReplaceVisible(replace, isVisible) {
        replace.element.classList.toggle('yoficator-replace-active', isVisible);
    }

    focusOnReplace(replace) {
        // scroll into view
        const wordStartPos = this.cm.posFromIndex(replace.wordStartIndex);
        const wordEndPos = this.cm.posFromIndex(replace.wordEndIndex - 1);
        const wordX = (this.cm.charCoords(wordStartPos, 'local').top + this.cm.charCoords(wordEndPos, 'local').bottom) / 2;
        this.cm.scrollTo(null, wordX - this.editorHeight / 2);

        // move cursor
        if (!main.isMobile) {
            this.cm.focus();
            this.cm.setCursor(wordEndPos, { bias: +1 });
        }
    }

    toggleReplaceAccept(replace, isAccept) {
        replace.element.textContent = isAccept ? replace.yoword : replace.originalWord;
    }

    async cleanUp() {
        await super.cleanUp();
        if (main.isMobile) {
            this.removeOverlay();
        }
        for (const replace of this.replaces) {
            const { from, to } = replace.cmMarker.find();
            this.cm.replaceRange(replace.element.textContent, from, to);
            replace.cmMarker.clear();
        }
    }
}

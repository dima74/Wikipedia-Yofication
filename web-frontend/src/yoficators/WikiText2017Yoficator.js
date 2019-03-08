import toast from '../toast';
import WikitextBaseYoficator from './WikitextBaseYoficator';
import { assert, sleep } from '../base';
import { copyFontCssProperties } from './utility';

const styles = `
.yoficator-replace {
	align-items: center;
	justify-content: center;
	margin-left: -3px;
	padding-left: 3px;
}

.yoficator-replace:not(.yoficator-replace-active) {
	display: none;
}
`;

export default class WikiText2017Yoficator extends WikitextBaseYoficator {
    get padding() {
        return 4;
    }

    get styles() {
        return super.styles + styles;
    }

    async initEditor() {
        await new Promise(resolve => mw.hook('ve.activationComplete').add(resolve));
        this.surface = ve.init.target.getSurface();
        this.surfaceModel = this.surface.getModel();
        this.surfaceView = this.surface.getView();
    }

    async init() {
        await this.initEditor();
        this.replaces = await super.fetchReplaces();
        if (this.replaces.length === 0) return;

        this.preventUpdateHighlightsPositions = false;  // updateHighlightsPositions возможно медленный, не нужно его вызывать, если текст изменяет наш скрипт (а не пользователь)
        this.applyReplacePromises = [];

        toast('Обрабатываем замены...');
        await sleep(0);
        this.highlightsWrapper = document.createElement('div');
        $('.ve-ui-overlay-local').append(this.highlightsWrapper);

        for (const replace of this.replaces) {
            // https://github.com/wikimedia/VisualEditor/blob/e2a8e4f0df38ee2cdc30174638d8b06947069816/src/ui/dialogs/ve.ui.FindAndReplaceDialog.js#L526
            // но вообще там обрабатывается случай когда range описывается несколькими boundingBox-ами:
            //   https://github.com/wikimedia/VisualEditor/blob/e2a8e4f0df38ee2cdc30174638d8b06947069816/src/ui/dialogs/ve.ui.FindAndReplaceDialog.js#L472
            const range = new ve.Range(replace.wordStartIndex, replace.wordEndIndex);
            replace.fragment = this.surfaceModel.getLinearFragment(range);
            replace.element = super.createReplaceElement(replace);
            replace.element.style.position = 'absolute';

            const nativeRange = this.surfaceView.getNativeRange(range);
            assert(nativeRange.startContainer === nativeRange.endContainer);
            copyFontCssProperties(replace.element, nativeRange.startContainer.parentElement);

            this.highlightsWrapper.appendChild(replace.element);
        }

        this.updateHighlightsPositions = this.updateHighlightsPositions.bind(this);
        this.updateHighlightsPositions();
        // https://github.com/wikimedia/VisualEditor/blob/e2a8e4f0df38ee2cdc30174638d8b06947069816/src/ui/dialogs/ve.ui.FindAndReplaceDialog.js#L219
        this.surfaceModel.connect(this, { documentUpdate: this.updateHighlightsPositions });
        window.addEventListener('resize', this.updateHighlightsPositions);
    }

    getWikitext() {
        return this.surfaceModel.getLinearFragment(this.surfaceModel.getDocument().getDocumentRange()).getText(true);
    }

    updateHighlightsPositions() {
        if (this.preventUpdateHighlightsPositions) return;
        for (const replace of this.replaces) {
            replace.rect = this.surfaceView.getSelection(replace.fragment.getSelection()).getSelectionBoundingRect();
            let { left, top, width, height } = replace.rect;
            $(replace.element).css({ left, top, width, height });
        }
    }

    toggleReplaceVisible(replace, isVisible) {
        replace.element.classList.toggle('yoficator-replace-active', isVisible);
        if (!isVisible) return;

        // scroll into view
        // https://github.com/wikimedia/VisualEditor/blob/e2a8e4f0df38ee2cdc30174638d8b06947069816/src/ui/dialogs/ve.ui.FindAndReplaceDialog.js#L530-L540
        const offset = replace.rect.top + this.surfaceView.$element.offset().top;
        const windowScrollHeight = this.surfaceView.$window.height() - this.surface.toolbarHeight;
        document.scrollingElement.scrollTop = offset - (windowScrollHeight / 2);

        // move cursor
        replace.fragment.collapseToEnd().select();
    }

    toggleReplaceAccept(replace, isAccept) {
        const applyReplacePromise = this.toggleReplaceAcceptAsync(replace, isAccept);
        this.applyReplacePromises.push(applyReplacePromise);
    }

    async toggleReplaceAcceptAsync(replace, isAccept) {
        await sleep(0);

        // replace.fragment магическим образом сохраняется при редактировании окружающего текста
        const textOld = replace.fragment.getText();
        const textNew = isAccept ? replace.yoword : replace.originalWord;
        if (textNew !== textOld) {
            this.preventUpdateHighlightsPositions = true;
            replace.fragment.setAutoSelect(false);  // чтобы текст не выделялся
            replace.fragment.insertContent(textNew);  // insertContent очень медленный (~300ms)
            this.preventUpdateHighlightsPositions = false;
        }

        if (this.currentReplaceIndex + 1 === this.replaces.length) {
            replace.fragment.collapseToEnd().select();  // чтобы после ёфикации позиция курсора была после последнего слова (а не до)
        }
    }

    async cleanUp() {
        await super.cleanUp();

        window.removeEventListener('resize', this.updateHighlightsPositions);
        await Promise.all(this.applyReplacePromises);

        this.highlightsWrapper.remove();
    }
}

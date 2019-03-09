import { assert, sleep } from '../base';
import StringHelper from '../string-helper';
import toast from '../toast';
import main from '../main';
import settings from '../settings';
import { BACKEND_HOST } from '../constants';
import { currentPageName } from '../wikipedia-api';

const createStyles = (padding, frequencyHintHeight) => `
.yoficator-replace-active {
	background-color: aquamarine;
	position: relative;
	display: inline-flex;
	margin: -${padding - 1}px -${padding}px;
	padding: ${padding - 1}px ${padding}px;
}

.yoficator-replace-active::before {
	width: var(--frequency-hint-width);
	background-color: var(--frequency-hint-color);
	content: '';
	height: ${frequencyHintHeight}px;
	position: absolute;
	left: 0;
	top: -${frequencyHintHeight}px;
}
`;

export function getReplaceHintColor(frequency) {
    frequency /= 100;
    const limits = [
        [0.6, 'green'],
        [0.4, 'orange'],
        [0.0, 'red'],
    ];
    for (const [limit, color] of limits) {
        if (frequency >= limit) {
            return color;
        }
    }
    assert(false);
}

export default class BaseYoficator {
    // виртуальные методы:
    init() {}

    toggleReplaceVisible(replace, isVisible) {}

    focusOnReplace(replace) {}

    toggleReplaceAccept(replace, isAccept) {}

    onWindowResize() {}

    async onYoficationEnd() {}

    //

    constructor() {
        this.currentReplaceIndex = -1;
        this.previousHighlightedReplace = null;
        this.ignoredEwords = new Set();
        // можно приостановить ёфикация, с целью немного изменить соседний текст (флаг нужен, чтобы нажатия клавиш не вызывали actions)
        this.isPaused = false;
    }

    get padding() {
        return 2;
    }

    get frequencyHintHeight() {
        return 3;
    }

    get styles() {
        return createStyles(this.padding, this.frequencyHintHeight);
    }

    get currentReplace() {
        return this.replaces[this.currentReplaceIndex];
    }

    async perform() {
        $(`<style>${this.styles}</style>`).appendTo(document.head);
        await this.init();

        if (this.replaces.length === 0) {
            toast('Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)');
            this.tryContinueContinuousYofication(false);
            return;
        }

        this.goToNextReplace();
        this.initializeActions();

        this.onWindowResizeBaseBinded = this.onWindowBaseResize.bind(this);
        window.addEventListener('resize', this.onWindowResizeBaseBinded);
    }

    initializeActions() {
        const actions = {
            'KeyJ': this.acceptReplace,
            'KeyF': this.rejectReplace,
            'KeyG': this.rejectReplaceAndAllSameEwords,
            // ещё раз показать последнюю замену
            'Semicolon': this.showCurrentReplaceAgain,
            // вернуться к предыдущей замене
            'KeyA': this.goToPreviousReplace,
            // отменить ёфикация текущей страницы
            'KeyQ': this.abortYofication,
            // открыть страницу со словом в викисловаре
            'KeyW': this.openYowordWiktionaryPage,
            // открыть страницу с дополнительной статистикой о слове (общее число слов и число слов с «ё» в Википедии
            'KeyS': this.openYowordStatPage,
            // открыть статья в новой вкладке
            'KeyN': this.openArticlePage,
        };

        this.onKeydown = event => {
            // приостановка ёфикация по комбинация Alt+O для возможности редактировать викитекст
            const togglePause = event.code === 'KeyO' && event.altKey;
            if (togglePause) {
                this.isPaused ^= true;
                return;
            }

            if (this.isPaused) return;
            if (event.code in actions) {
                event.preventDefault();
                actions[event.code].call(this);
            }
        };
        document.addEventListener('keydown', this.onKeydown);
    }

    goToNextReplace() {
        assert(this.currentReplaceIndex !== this.replaces.length, 'this.currentReplaceIndex !== this.replaces.length');
        do {
            ++this.currentReplaceIndex;
        } while (!this.goToCurrentReplace());
    }

    goToPreviousReplace() {
        if (this.currentReplaceIndex === 0) {
            return;
        }
        --this.currentReplaceIndex;
        while (this.currentReplaceIndex >= 0 && !this.goToCurrentReplace()) {
            --this.currentReplaceIndex;
        }
        if (this.currentReplaceIndex < 0) {
            this.currentReplaceIndex = 0;
            throw 'goToPreviousReplace: currentReplace < 0';
        }

        this.currentReplace.isAccept = false;
        this.toggleReplaceAccept(this.currentReplace, false);
    }

    goToCurrentReplace() {
        if (this.currentReplaceIndex === this.replaces.length) {
            this.onYoficationEndBase();
            return true;
        }
        assert(this.currentReplaceIndex < this.replaces.length);

        const replace = this.currentReplace;
        const yoword = replace.yoword;

        const eword = StringHelper.deyoficate(yoword);
        if (this.ignoredEwords.has(eword)) {
            return false;
        }

        const statusFrequency = `${replace.frequency}%` + (replace.isSafe ? ' (safe)' : '');
        const status = `${statusFrequency}\n${yoword}\nЗамена ${this.currentReplaceIndex + 1} из ${this.replaces.length}`;
        toast(status);

        if (this.previousHighlightedReplace !== null) {
            this.toggleReplaceVisible(this.previousHighlightedReplace, false);
        }
        this.toggleReplaceVisible(this.currentReplace, true);
        this.focusOnReplace(this.currentReplace);
        this.previousHighlightedReplace = replace;
        return true;
    }

    acceptReplace() {
        this.currentReplace.isAccept = true;
        this.toggleReplaceAccept(this.currentReplace, true);
        this.goToNextReplace();
    }

    rejectReplace() {
        this.currentReplace.isAccept = false;
        this.toggleReplaceAccept(this.currentReplace, false);
        this.goToNextReplace();
    }

    rejectReplaceAndAllSameEwords() {
        const replace = this.currentReplace;
        const eword = StringHelper.deyoficate(replace.yoword);
        this.ignoredEwords.add(eword);
        this.rejectReplace();
    }

    showCurrentReplaceAgain() {
        if (this.currentReplace) {
            this.focusOnReplace(this.currentReplace);
        }
    }

    onWindowBaseResize() {
        this.onWindowResize();
        if (this.currentReplace) {
            this.focusOnReplace(this.currentReplace);
        }
    }

    abortYofication() {
        if (!main.isContinuousYofication) {
            toast(this.isPageMode ? 'Ёфикация отменена' : 'Ёфикация прервана', 7000);
        }
        this.cleanUp();
        this.tryContinueContinuousYofication(false);
    }

    async cleanUp() {
        document.removeEventListener('keydown', this.onKeydown);
        window.removeEventListener('resize', this.onWindowResizeBaseBinded);
        if (this.previousHighlightedReplace !== null) {
            this.toggleReplaceVisible(this.previousHighlightedReplace, false);
        }
    }

    async onYoficationEndBase() {
        toast('Завершаем ёфикацию...');
        await sleep(0);

        await this.cleanUp();
        await this.onYoficationEnd();

        const hasAcceptedReplaces = this.replaces.some(replace => replace.isAccept);
        toast(hasAcceptedReplaces ? 'Ёфикация завершена' : 'Ёфикация завершена\n(ни одна замена не была принята)', hasAcceptedReplaces ? 4000 : 7000);
        this.tryContinueContinuousYofication(hasAcceptedReplaces);
    }

    tryContinueContinuousYofication(hasAcceptedReplaces) {
        if (!main.isContinuousYofication) return;

        if (hasAcceptedReplaces) {
            this.beforeContinueContinuousYofication();
        } else {
            main.performContinuousYofication();
        }
    }

    async beforeContinueContinuousYofication() {
        // предполагается, что ContinuousYofication будет использоваться только в классическом редакторе викитекста

        toast('Производим правку...');
        $('#wpSummary').val(settings.editSummary);
        $('#wpMinoredit').prop('checked', true);

        sessionStorage.setItem('yoficator:continuous-yofication-next-page', await main.nextPageNamePromise);
        $('#wpSave').click();
    }

    openYowordWiktionaryPage() {
        const yoword = this.currentReplace.yoword.toLowerCase();
        window.open(BACKEND_HOST + '/wikipedia/redirectToWiktionaryArticle/' + yoword);
    }

    openYowordStatPage() {
        const yoword = this.currentReplace.yoword;
        window.open(BACKEND_HOST + '/stat/' + yoword);
    }

    openArticlePage() {
        window.open('/wiki/' + currentPageName);
    }
}

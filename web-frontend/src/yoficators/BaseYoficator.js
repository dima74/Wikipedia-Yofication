import { assert, sleep } from '../base';
import StringHelper from '../string-helper';
import toast from '../toast';
import main from '../main';
import { WIKTIONARY_REDIRECT_URL } from '../settings';

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
    init() {}

    toggleReplaceVisible(replace, isVisible) {}

    toggleReplaceAccept(replace, isAccept) {}

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

        // todo
        // if (IS_MOBILE) {
        //     const overlay = this.createMobileOverlay();
        //     overlay.click(event => {
        //         // в мобильной версии доступны три действия:
        //         //     нажатие на верхнюю 1/4 часть экрана --- переход к следующей странице
        //         //     нажатие на правую часть экрана ---   принять замену
        //         //     нажатие на  левую часть экрана --- отклонить замену
        //         if (event.offsetY <= $(window).height() / 4) {
        //             this.abortYofication();
        //         } else if (event.offsetX >= $(window).width() / 2) {
        //             this.acceptReplace();
        //         } else {
        //             this.rejectReplace();
        //         }
        //     });
        // }
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
            toast('Завершаем ёфикацию...');
            sleep(0).then(() => this.onYoficationEnd(false));
            return true;
        }
        if (this.currentReplaceIndex > this.replaces.length) {
            throw 'goToCurrentReplace: currentReplace > replaces.length';
        }

        const replace = this.currentReplace;
        const yoword = replace.yoword;

        const eword = StringHelper.deyoficate(yoword);
        if (this.ignoredEwords.has(eword)) {
            return false;
        }

        const status = `${replace.frequency}%\n${yoword}\nЗамена ${this.currentReplaceIndex + 1} из ${this.replaces.length}`;
        toast(status);

        if (this.previousHighlightedReplace !== null) {
            this.toggleReplaceVisible(this.previousHighlightedReplace, false);
        }
        this.toggleReplaceVisible(this.currentReplace, true);
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
        this.toggleReplaceVisible(this.currentReplace, true);
    }

    abortYofication() {
        if (!main.isContinuousYofication) {
            // todo 'Ёфикация отменена' в page mode и 'Ёфикация прервана' иначе
            toast('Ёфикация прервана', 7000);
        }
        this.onYoficationEnd(true);
    }

    onYoficationEnd(forceNoEdit) {
        document.removeEventListener('keydown', this.onKeydown);

        // todo only in page mode
        // removeArgumentsFromUrl();

        const hasAcceptedReplaces = !forceNoEdit && this.replaces.some(replace => replace.isAccept);
        if (!forceNoEdit) {
            toast(hasAcceptedReplaces ? 'Ёфикация завершена' : 'Ёфикация завершена\n(ни одна замена не была принята)', hasAcceptedReplaces ? 4000 : 7000);
        }
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
        $('#wpSummary').val(main.settings.editSummary);
        $('#wpMinoredit').prop('checked', true);

        sessionStorage.setItem('yoficator:continuous-yofication-next-page', await main.nextPageNamePromise);
        $('#wpSave').click();
    }

    openYowordWiktionaryPage() {
        const wordEndings = ['ая', 'ое', 'ой', 'ою', 'ом', 'ого', 'ому', 'ую', 'ый', 'ым', 'ых', 'ые', 'ыми'];
        let yoword = this.currentReplace.yoword;
        for (const wordEnding of wordEndings) {
            if (yoword.endsWith(wordEnding)) {
                yoword = yoword.substring(0, yoword.length - wordEnding.length) + 'ый';
                break;
            }
        }
        window.open(WIKTIONARY_REDIRECT_URL + yoword);
    }
}

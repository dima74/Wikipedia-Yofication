import toast from '../toast';
import { assert, sleep } from '../base';
import WikitextBaseYoficator from './WikitextBaseYoficator';
import main from '../main';
import createOverlay from './mobileOverlay';

// Поддержка CodeMirror 6 (подсветка синтаксиса в редакторе викитекста).
// Подход (хук ext.CodeMirror.ready + декорации CodeMirror 6) предложен участником Petsernik:
// https://ru.wikipedia.org/wiki/Участник:Petsernik/yoficator.js

const CODEMIRROR_LOAD_TIMEOUT = 30000;

// Возвращает экземпляр CodeMirror, если в редакторе викитекста (#wpTextbox1) включена подсветка синтаксиса, иначе null
export async function getActiveCodeMirror() {
    const textarea = document.getElementById('wpTextbox1');
    const hook = mw.hook('ext.CodeMirror.ready');
    let onReady;
    const codeMirrorPromise = new Promise(resolve => {
        onReady = cm => cm.textarea === textarea && resolve(cm);
        // у mw.hook есть память, поэтому если CodeMirror уже загружен, обработчик вызовется сразу
        hook.add(onReady);
    });

    // CodeMirror загружается при открытии редактора, если в настройках включена подсветка синтаксиса
    // (модуль ext.CodeMirror.init загружается и без неё, для кнопки включения подсветки на панели инструментов)
    const initModuleState = mw.loader.getState('ext.CodeMirror.init');
    const isLoading = mw.user.options.get('usecodemirror') > 0 && ['loading', 'loaded', 'executing', 'ready'].includes(initModuleState);
    if (isLoading) {
        toast('Ожидаем завершения загрузки редактора...');
    }

    const cm = await Promise.race([
        codeMirrorPromise,
        sleep(isLoading ? CODEMIRROR_LOAD_TIMEOUT : 0).then(() => null),
    ]);
    hook.remove(onReady);
    assert(cm !== null || !isLoading, 'Не удалось дождаться загрузки редактора (подсветки синтаксиса). Попробуйте перезагрузить страницу.');
    // подсветку синтаксиса можно выключить кнопкой на панели инструментов, тогда используется обычный textarea
    return cm !== null && cm.isActive ? cm : null;
}

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

        this.cm = await getActiveCodeMirror();
        assert(this.cm !== null);
        this.view = this.cm.view;
        const requireCodeMirror = await mw.loader.using('ext.CodeMirror.lib');
        const { Compartment, Decoration, EditorView, StateEffect, StateField, WidgetType } = requireCodeMirror('ext.CodeMirror.lib');
        this.EditorView = EditorView;

        this.replaces = await super.fetchReplaces();
        if (this.replaces.length === 0) return;

        toast('Обрабатываем замены...');
        await sleep(0);

        // каждая замена отображается виджетом вместо исходного слова (аналог markText с replacedWith в CodeMirror 5);
        // при изменении состояния замены (подсвечена/принята) виджет пересоздаётся
        const yoficator = this;
        class ReplaceWidget extends WidgetType {
            constructor(replace) {
                super();
                this.replace = replace;
                this.isVisible = !!replace.isVisible;
                this.isAccept = !!replace.isAccept;
            }

            eq(other) {
                return other.replace === this.replace && other.isVisible === this.isVisible && other.isAccept === this.isAccept;
            }

            toDOM() {
                const element = yoficator.createReplaceElement(this.replace);
                element.classList.toggle('yoficator-replace-active', this.isVisible);
                element.textContent = this.isAccept ? this.replace.yoword : this.replace.originalWord;
                return element;
            }
        }
        const createDecoration = replace => Decoration.replace({ widget: new ReplaceWidget(replace) });

        this.updateReplaceEffect = StateEffect.define();
        const updateReplaceEffect = this.updateReplaceEffect;
        this.decorationsField = StateField.define({
            create: () => Decoration.set(this.replaces.map(replace => createDecoration(replace).range(replace.wordStartIndex, replace.wordEndIndex)), true),
            update: (decorations, transaction) => {
                // позиции замен сдвигаются, если во время ёфикации викитекст редактируется (после Alt+O)
                decorations = decorations.map(transaction.changes);
                for (const effect of transaction.effects) {
                    if (!effect.is(updateReplaceEffect)) continue;
                    const replace = effect.value;
                    const range = findDecorationRange(decorations, replace);
                    if (range === null) continue;
                    decorations = decorations.update({
                        filter: (from, to, decoration) => decoration.spec.widget.replace !== replace,
                        add: [createDecoration(replace).range(range.from, range.to)],
                    });
                }
                return decorations;
            },
            provide: field => [
                EditorView.decorations.from(field),
                // курсор перескакивает через слово целиком (аналог atomic в CodeMirror 5)
                EditorView.atomicRanges.of(view => view.state.field(field)),
            ],
        });
        this.compartment = new Compartment();
        this.cm.applyExtension(this.compartment.of(this.decorationsField));

        if (main.isContinuousYofication) {
            const editorRect = this.view.scrollDOM.getBoundingClientRect();
            const y = main.isMobile ? (editorRect.top - 3) : (editorRect.top + editorRect.bottom) / 2 - window.innerHeight / 2;
            window.scrollBy(0, y);
        }
    }

    getWikitext() {
        return this.view.state.doc.toString();
    }

    getReplaceRange(replace) {
        return findDecorationRange(this.view.state.field(this.decorationsField), replace);
    }

    toggleReplaceVisible(replace, isVisible) {
        replace.isVisible = isVisible;
        this.view.dispatch({ effects: this.updateReplaceEffect.of(replace) });
    }

    focusOnReplace(replace) {
        const range = this.getReplaceRange(replace);
        if (range === null) return;

        // scroll into view
        const effects = this.EditorView.scrollIntoView(range.from, { y: 'center' });

        // move cursor
        if (main.isMobile) {
            this.view.dispatch({ effects });
        } else {
            this.view.dispatch({ effects, selection: { anchor: range.to } });
            this.view.focus();
        }
    }

    toggleReplaceAccept(replace, isAccept) {
        this.view.dispatch({ effects: this.updateReplaceEffect.of(replace) });
    }

    async cleanUp() {
        await super.cleanUp();
        if (main.isMobile) {
            this.removeOverlay();
        }

        // все принятые замены применяются одной транзакцией (одно действие для Ctrl+Z)
        const changes = [];
        const decorations = this.view.state.field(this.decorationsField);
        for (const iterator = decorations.iter(); iterator.value !== null; iterator.next()) {
            const replace = iterator.value.spec.widget.replace;
            if (replace.isAccept) {
                changes.push({ from: iterator.from, to: iterator.to, insert: replace.yoword });
            }
        }
        this.view.dispatch({ changes, effects: this.compartment.reconfigure([]) });
    }
}

function findDecorationRange(decorations, replace) {
    for (const iterator = decorations.iter(); iterator.value !== null; iterator.next()) {
        if (iterator.value.spec.widget.replace === replace) {
            return { from: iterator.from, to: iterator.to };
        }
    }
    return null;
}

import toast from './toast';
import {removeArgumentsFromUrl} from './base';

export default class Yofication {
    constructor(continuousYofication) {
        this.continuousYofication = continuousYofication;
    }

    async perform() {
        toast('Загружаем список замен...');
        let {replaces, revision} = await this.backend.getReplaces(this.wikipediaApi.getPageName());
        if (revision !== mw.config.get('wgCurRevisionId')) {
            throw `revision doesn't match`;
        }

        replaces = replaces.filter(replace => replace.frequency >= settings.minReplaceFrequency * 100);
        if (replaces.length === 0) {
            toast('Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)');
            removeArgumentsFromUrl();
            return Promise.resolve();
        }
        replaces.forEach(replace => replace.isAccept = false);

        let textDiv = $('#mw-content-text');
        let text = textDiv.html();
        let iReplace = -1;
        let done = false;
        this.goToNextReplace();
        $(window).on('resize', this.scrollToReplace);

        let actions = {
            'j': acceptReplace,
            'о': acceptReplace,
            'f': rejectReplace,
            'а': rejectReplace,
            // ещё раз показать последнюю замену
            ';': showCurrentReplaceAgain,
            'ж': showCurrentReplaceAgain,
            // вернуться к предыдущей замене
            'a': goToPreviousReplace,
            'ф': goToPreviousReplace
        };

        $(document).keypress((event) => {
                if (!done && event.key in actions) {
                    actions[event.key]();
                }
            }
        );
    }

    goToNextReplace() {
        while (!goToReplace(++iReplace)) {}
    }

    goToPreviousReplace() {
        --iReplace;
        while (iReplace >= 0 && !goToReplace(iReplace)) {
            --iReplace;
        }
        if (iReplace < 0) {
            iReplace = 0;
            throw 'goToPreviousReplace: iReplace < 0';
        }
        replaces[iReplace].isAccept = false;
    }

    makeChange(callback) {
        done = true;
        let replacesRight = replaces.filter(replace => replace.isAccept);
        if (replacesRight.length === 0) {
            callback();
            return;
        }
        toast('Делаем правку: \nЗагружаем викитекст страницы...');
        WikiText(function (wikitext) {
                toast('Делаем правку: \nПрименяем замены...');
                let replaceSomething = false;
                for (let i = 0; i < replacesRight.length; ++i) {
                    let replace = replacesRight[i];
                    let eword = replace.eword;
                    if (wikitext.substr(replace.indexWordStart, eword.length) !== eword.deyofication()) {
                        exit('Ошибка: викитекст страницы "' + currentPageTitle + '" не совпадает в индексе ' + replace.indexWordStart
                            + '\nПожалуйста, сообщите название этой страницы [[Участник:Дима74|автору скрипта]].'
                            + '\nожидается: "' + eword.deyofication() + '"'
                            + '\nполучено: "' + wikitext.substr(replace.indexWordStart, eword.length) + '"', false);
                        return;
                    }
                    wikitext = wikitext.insert(replace.indexWordStart, eword, eword.length);
                    replaceSomething = true;
                }

                if (replaceSomething) {
                    toast('Делаем правку: \nОтправляем изменения...');
                    editPage({
                        title: currentPageTitle,
                        text: wikitext,
                        summary: editSummary
                    }, callback);
                }
            }
        );
    }

    goToReplace(iReplace) {
        if (iReplace === replaces.length) {
            textDiv.html(text);
            makeChange(continuousYofication ? goToNextPage : removeArgumentsFromUrl);
            return true;
        }
        if (iReplace > replaces.length) {
            throw 'goToReplace: iReplace > replaces.length';
        }

        let replace = replaces[iReplace];
        let eword = replace.eword;
        let status = 'Замена ' + (iReplace + 1) + ' из ' + replaces.length + '\n' + eword + '\nЧастота: ' + replace.frequency + '%';
        toast(status);
        let indexes = text.getIndexesOf(eword.deyofication());

        // игнорируем вхождения dword внутри слов
        indexes = indexes.filter(function (i) {
                let j = i + eword.length;
                return (i === 0 || !text[i - 1].isRussianLetterInWord()) && (j === text.length || !text[j].isRussianLetterInWord());
            }
        );

        // выделяем цветом
        if (indexes.length !== replace.numberSameDwords) {
            toast(status + '\nПредупреждение: не совпадает numberSameDwords\nНайдено: ' + indexes.length + '\nДолжно быть: ' + replace.numberSameDwords + ' \n(индексы найденных: ' + indexes + ')');
            return false;
        }
        let indexWordStart = indexes[replace.numberSameDwordsBefore];
        let textNew = text.insert(indexWordStart, '<span style="background: cyan;" id="yofication-replace">' + eword + '</span>', eword.length);
        textDiv.html(textNew);

        // проверяем на видимость
        if (!$('#yofication-replace').is(':visible')) {
            console.log('Предупреждение: замена не видна');
            return false;
        }

        // скроллим
        scrollToReplace();
        return true;
    }

    acceptReplace() {
        replaces[iReplace].isAccept = true;
        goToNextReplace();
    }

    rejectReplace() {
        goToNextReplace();
    }

    showCurrentReplaceAgain() {
        scrollToReplace();
    }

    scrollToReplace() {
        let replace = $('#yofication-replace');
        if (replace.length) {
            $.scrollTo(replace, {over: 0.5, offset: -$(window).height() / 2});
        }
    }
}
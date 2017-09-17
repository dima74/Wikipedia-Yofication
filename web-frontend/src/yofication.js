import toast from './toast';
import {fetchJson, removeArgumentsFromUrl} from './base';
import {main} from './main'
import {currentPageName} from "./wikipedia-api";

String.prototype.insert = function (i, s, numberCharsToReplace) {
    return this.substr(0, i) + s + this.substr(i + numberCharsToReplace);
};

String.prototype.getIndexesOf = function (s) {
    let indexes = [];
    let start = 0;
    let position;
    while ((position = this.indexOf(s, start)) !== -1) {
        indexes.push(position);
        start = position + s.length;
    }
    return indexes;
};

String.prototype.deyofication = function () {
    return this.replace('ё', 'е');
};

String.prototype.isRussianLetterInWord = function () {
    return this.length === 1 && this.match(/[а-яА-ЯёЁ\-\u00AD\u0301]/);
};

export default class Yofication {
    constructor(continuousYofication) {
        this.continuousYofication = continuousYofication;
        this.textDiv = $('#mw-content-text');
        this.text = this.textDiv.html();
        this.iReplace = -1;
        this.done = false;
        this.wikitext = main.wikipediaApi.getWikitext(currentPageName);
    }

    async perform() {
        toast('Загружаем список замен...');
        let {replaces, revision} = await main.backend.getReplaces(currentPageName);
        this.replaces = replaces;

        let revisionLocal = mw.config.get('wgCurRevisionId');
        if (revision !== revisionLocal) {
            throw `revision doesn't match\n local: ${revisionLocal} \nremote: ${revision}`;
        }

        replaces = replaces.filter(replace => replace.frequency >= main.settings.minReplaceFrequency);
        if (replaces.length === 0) {
            toast('Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)');
            removeArgumentsFromUrl();
            return;
        }
        replaces.forEach(replace => replace.isAccept = false);

        this.goToNextReplace();
        $(window).on('resize', this.scrollToReplace);
        this.initializeActions();
    }

    initializeActions() {
        let actionsArray = [
            [this.acceptReplace, 'j', 'о'],
            [this.rejectReplace, 'f', 'а'],
            // ещё раз показать последнюю замену
            [this.showCurrentReplaceAgain, ';', 'ж'],
            // вернуться к предыдущей замене
            [this.goToPreviousReplace, 'a', 'ф']
        ];

        let actions = {};
        for (let action of actionsArray) {
            let actionFunction = action[0];
            let keys = action.slice(1);
            for (let key of keys) {
                actions[key] = actionFunction;
            }
        }

        $(document).keypress((event) => {
                if (!this.done && event.key in actions) {
                    actions[event.key]();
                }
            }
        );
    }

    goToNextReplace() {
        while (!this.goToReplace(++this.iReplace)) {}
    }

    goToPreviousReplace() {
        --this.iReplace;
        while (this.iReplace >= 0 && !this.goToReplace(this.iReplace)) {
            --this.iReplace;
        }
        if (this.iReplace < 0) {
            this.iReplace = 0;
            throw 'goToPreviousReplace: iReplace < 0';
        }
        this.replaces[this.iReplace].isAccept = false;
    }

    goToReplace(iReplace) {
        if (this.iReplace === this.replaces.length) {
            this.textDiv.html(text);
            this.makeChange(this.continuousYofication ? this.goToNextPage : removeArgumentsFromUrl);
            return true;
        }
        if (this.iReplace > this.replaces.length) {
            throw 'goToReplace: iReplace > replaces.length';
        }

        let replace = this.replaces[iReplace];
        let yoword = replace.yoword;
        let status = 'Замена ' + (this.iReplace + 1) + ' из ' + this.replaces.length + '\n' + yoword + '\nЧастота: ' + replace.frequency + '%';
        toast(status);
        let indexes = this.text.getIndexesOf(yoword.deyofication());

        // игнорируем вхождения dword внутри слов
        indexes = indexes.filter(i => {
                let j = i + yoword.length;
                return (i === 0 || !this.text[i - 1].isRussianLetterInWord()) && (j === this.text.length || !this.text[j].isRussianLetterInWord());
            }
        );

        // выделяем цветом
        if (indexes.length !== replace.numberSameDwords) {
            toast(status + '\nПредупреждение: не совпадает numberSameDwords\nНайдено: ' + indexes.length + '\nДолжно быть: ' + replace.numberSameDwords + ' \n(индексы найденных: ' + indexes + ')');
            return false;
        }
        let wordIndexStart = indexes[replace.numberSameDwordsBefore];
        let textNew = this.text.insert(wordIndexStart, '<span style="background: cyan;" id="yofication-replace">' + yoword + '</span>', yoword.length);
        this.textDiv.html(textNew);

        // проверяем на видимость
        if (!$('#yofication-replace').is(':visible')) {
            console.log('Предупреждение: замена не видна');
            return false;
        }

        // скроллим
        this.scrollToReplace();
        return true;
    }

    acceptReplace() {
        this.replaces[iReplace].isAccept = true;
        this.goToNextReplace();
    }

    rejectReplace() {
        this.goToNextReplace();
    }

    showCurrentReplaceAgain() {
        this.scrollToReplace();
    }

    scrollToReplace() {
        let replace = $('#yofication-replace');
        if (replace.length) {
            $.scrollTo(replace, {over: 0.5, offset: -$(window).height() / 2});
        }
    }

    async makeChange() {
        this.done = true;
        let replacesRight = this.replaces.filter(replace => replace.isAccept);
        if (replacesRight.length === 0) {
            toast();
            return;
        }

        toast('Делаем правку: \nЗагружаем викитекст страницы...');
        let wikitext = await this.wikitext;
        toast('Делаем правку: \nПрименяем замены...');
        let replaceSomething = false;
        for (let i = 0; i < replacesRight.length; ++i) {
            let replace = replacesRight[i];
            let yoword = replace.yoword;
            if (wikitext.substr(replace.wordIndexStart, yoword.length) !== yoword.deyofication()) {
                exit('Ошибка: викитекст страницы "' + currentPageName + '" не совпадает в индексе ' + replace.wordIndexStart
                    + '\nПожалуйста, сообщите название этой страницы [[Участник:Дима74|автору скрипта]].'
                    + '\nожидается: "' + yoword.deyofication() + '"'
                    + '\nполучено: "' + wikitext.substr(replace.wordIndexStart, yoword.length) + '"', false);
                return;
            }
            wikitext = wikitext.insert(replace.wordIndexStart, yoword, yoword.length);
            replaceSomething = true;
        }

        if (replaceSomething) {
            toast('Делаем правку: \nОтправляем изменения...');
            let response = await fetchJson('/w/api.php', {
                errorMessage: 'Не удалось произвести правку',
                type: 'POST',
                data: {
                    format: 'json',
                    action: 'edit',
                    title: currentPageName,
                    minor: true,
                    text: wikitext,
                    summary: main.settings.editSummary,
                    token: mw.user.tokens.get('editToken')
                }
            });
            if (!response.edit || response.edit.result !== 'Success') {
                console.log(response);
                toast('Не удалось произвести правку: ' + (data.edit ? data.edit.info : 'неизвестная ошибка'));
                return;
            }
            toast('Правка выполена');
        }
    }

    goToNextPage() {
        main.performContinuousYofication();
    }
}
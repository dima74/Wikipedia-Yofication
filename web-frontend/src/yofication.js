import toast from './toast';
import {assert, fetchJson, removeArgumentsFromUrl} from './base';
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
    return this.replace('ё', 'е').replace('Ё', 'Е');
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
        this.wikitextPromise = main.wikipediaApi.getWikitext(currentPageName);
    }

    async perform() {
        toast('Загружаем список замен...');
        let {replaces, revision} = await main.backend.getReplaces(currentPageName);

        toast('Загружаем викитекст...');
        this.wikitext = await this.wikitextPromise;
        for (let replace of replaces) {
            let dwordRemote = replace.yoword.deyofication();
            let dwordLocal = this.wikitext.substr(replace.wordStartIndex, dwordRemote.length);
            if (dwordLocal !== dwordRemote) {
                throw `викитекст страницы "${currentPageName}" не совпадает в индексе ${replace.wordStartIndex}`
                + `\nожидается: ${dwordRemote}"`
                + `\nполучено: "${dwordLocal}"`;
            }
        }

        let revisionLocal = mw.config.get('wgCurRevisionId');
        if (revision !== revisionLocal) {
            throw `revision doesn't match\n local: ${revisionLocal} \nremote: ${revision}`;
        }

        toast('Обрабатываем замены...');
        for (let replace of replaces) {
            assert(replace.frequency >= main.settings.minReplaceFrequency);
            replace.indexes = this.text.getIndexesOf(replace.yoword.deyofication());
            // игнорируем вхождения dword внутри слов
            replace.indexes = replace.indexes.filter(i => {
                    let j = i + replace.yoword.length;
                    return (i === 0 || !this.text[i - 1].isRussianLetterInWord()) && (j === this.text.length || !this.text[j].isRussianLetterInWord());
                }
            );
        }

        for (let replace of replaces) {
            if (replace.indexes.length !== replace.numberSameDwords) {
                console.log(`
${replace.yoword}
Предупреждение: не совпадает numberSameDwords
Найдено: ${replace.indexes.length}
Должно быть: ${replace.numberSameDwords} 
(индексы найденных: ${replace.indexes})`);
                for (let index of replace.indexes) {
                    console.log(`${index}: ${this.text.substr(index - 20, 40)}`)
                }
                // todo
                // assert(false);
            }
        }
        replaces = replaces.filter(replace => replace.indexes.length === replace.numberSameDwords);

        if (replaces.length === 0) {
            toast('Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)');
            this.afterYofication();
            return;
        }
        replaces.forEach(replace => replace.isAccept = false);
        this.replaces = replaces;

        if (replaces.length < 3) {
            this.afterYofication();
        }

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
            [this.goToPreviousReplace, 'a', 'ф'],
            // отменить ёфикация текущей страницы
            [this.afterYofication, 'q', 'й']
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
                    actions[event.key].call(this);
                }
            }
        );
    }

    goToNextReplace() {
        assert(this.iReplace !== this.replaces.length);
        while (!this.goToReplace(++this.iReplace)) {}
    }

    goToPreviousReplace() {
        if (this.iReplace === 0) {
            return;
        }
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
            this.textDiv.html(this.text);
            (async () => {
                await this.makeChange();
                this.afterYofication();
            })();
            return true;
        }
        if (this.iReplace > this.replaces.length) {
            throw 'goToReplace: iReplace > replaces.length';
        }

        let replace = this.replaces[iReplace];
        let yoword = replace.yoword;
        let status = `Замена ${this.iReplace + 1} из ${this.replaces.length}\n${yoword}\nЧастота: ${replace.frequency}%`;
        toast(status);

        // выделяем цветом
        let wordStartIndex = replace.indexes[replace.numberSameDwordsBefore];
        let textNew = this.text.insert(wordStartIndex, '<span style="background: cyan;" id="yofication-replace">' + yoword + '</span>', yoword.length);
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
        this.replaces[this.iReplace].isAccept = true;
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
            let y = replace.offset().top - ($(window).height() - replace.height()) / 2;
            window.scrollTo(0, y);
        }
    }

    async makeChange() {
        this.done = true;
        let replacesRight = this.replaces.filter(replace => replace.isAccept);
        if (replacesRight.length === 0) {
            toast('Ни одна замена не была принята');
            return;
        }

        toast('Делаем правку: \nЗагружаем викитекст страницы...');
        let wikitext = await this.wikitextPromise;
        toast('Делаем правку: \nПрименяем замены...');
        let replaceSomething = false;
        for (let i = 0; i < replacesRight.length; ++i) {
            let replace = replacesRight[i];
            let yoword = replace.yoword;
            if (wikitext.substr(replace.wordStartIndex, yoword.length) !== yoword.deyofication()) {
                toast('Ошибка: викитекст страницы "' + currentPageName + '" не совпадает в индексе ' + replace.wordStartIndex
                    + '\nПожалуйста, сообщите название этой страницы [[Участник:Дима74|автору скрипта]].'
                    + '\nожидается: "' + yoword.deyofication() + '"'
                    + '\nполучено: "' + wikitext.substr(replace.wordStartIndex, yoword.length) + '"');
                return;
            }
            wikitext = wikitext.insert(replace.wordStartIndex, yoword, yoword.length);
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

    afterYofication() {
        if (this.continuousYofication)
            this.goToNextPage();
        else
            removeArgumentsFromUrl();
    }
}
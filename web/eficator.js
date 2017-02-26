/*
 * Скрипт-Ёфикатор для Википедии
 * Инструкция по использованию находится по адресу https://ru.wikipedia.org/wiki/Участник:Дима74/Скрипт-Ёфикатор
 * Историю изменений можно найти на гитхабе: https://github.com/dima74/Wikipedia-Efication/commits/master
 */

var addPortletLinkAction = typeof Eficator_AddPortletLinkAction === 'undefined' ? true : Eficator_AddPortletLinkAction;
mw.loader.load('https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js', 'text/javascript');

$(function () {
    var currentPageTitle = mw.config.get('wgTitle');
    if (mw.config.get('wgPageName') == 'Служебная:Ёфикация') {
        goToNextPage();
    } else if (window.location.search.indexOf('efication=true') != -1) {
        checkForScrollTo();
        performEfication(window.location.search.indexOf('continuous_efication=true') != -1);
    } else if (addPortletLinkAction && mw.config.get('wgNamespaceNumber') === 0) {
        mw.util.addPortletLink('p-cactions', mw.config.get('wgPageName') + '?efication=true', 'Ёфицировать', 'ca-eficator', ' Ёфицировать страницу');
    }

    function checkForScrollTo() {
        if (typeof($.scrollTo) === 'undefined') {
            exit('Ошибка: $.scrollTo не определено.');
        }
    }

    function showStatus(status, error) {
        console.log(status);
        var snackbar = $('#eficator-snackbar');
        if (snackbar.length === 0) {
            $('body').append('<div id="eficator-snackbar" style="min-width: 250px; transform: translateX(-50%); background-color: #333; color: #fff; text-align: center; border-radius: 2px; padding: 16px; position: fixed; z-index: 1; left: 50%; bottom: 30px;">Спасибо, что воспользовались ёфикатором!</div>');
            snackbar = $('#eficator-snackbar');
        }
        if (typeof error !== 'undefined' && error) {
            status += '\nПожалуйста, попробуйте обновить страницу. \nЕсли это не поможет, свяжитесь с [[Участник:Дима74|автором скрипта]].';
        }
        status = status.replace(/\n/g, '<br />');
        status = status.replace(/\[\[([^|]*)\|([^\]]*)]]/g, '<a href="/wiki/$1" style="color: #0ff;">$2</a>');
        snackbar.html(status);
    }

    function scrollToReplace() {
        var replace = $('#efication-replace');
        if (replace.length) {
            $.scrollTo(replace, {over: 0.5, offset: -$(window).height() / 2});
        }
    }

    function exit(message) {
        if (typeof(message) === 'string') {
            showStatus(message, true);
        } else {
            message = '';
        }
        throw message;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function goToNextPage() {
        function errorGoToNextPage() {
            showStatus('Ошибка: Не удалось получить следующую страницу для ёфикации', true);
        }

        showStatus('Переходим к следующей странице: \nЗагружаем число страниц для ёфикации...');
        $.ajax({
            url: "https://raw.githubusercontent.com/dima74/Wikipedia-Efication-Replaces/master/numberPages",
            error: errorGoToNextPage,
            success: function (data) {
                showStatus('Переходим к следующей странице: \nЗагружаем название статьи для ёфикации...');
                var i = getRandomInt(0, Number(data));
                $.ajax({
                    url: "https://raw.githubusercontent.com/dima74/Wikipedia-Efication-Replaces/master/pagesToEfication/" + i,
                    error: errorGoToNextPage,
                    success: function (pageTitle) {
                        showStatus('Переходим к следующей странице: \nПеренаправляем на страницу "' + pageTitle + '"');
                        window.location.href = 'https://ru.wikipedia.org/wiki/' + pageTitle + '?continuous_efication=true';
                    }
                });
            }
        });
    }

    String.prototype.insert = function (i, s, numberCharsToReplace) {
        return this.substr(0, i) + s + this.substr(i + numberCharsToReplace);
    };

    String.prototype.getIndexesOf = function (s) {
        var indexes = [];
        var start = 0;
        var position;
        while ((position = this.indexOf(s, start)) != -1) {
            indexes.push(position);
            start = position + s.length;
        }
        return indexes;
    };

    String.prototype.deefication = function () {
        return this.replace('ё', 'е');
    };

    function performEfication(continuousEfication) {
        showStatus('Загружаем список замен...');
        $.ajax({
            url: 'https://raw.githubusercontent.com/dima74/Wikipedia-Efication-Replaces/master/replacesByTitles/' + currentPageTitle,
            dataType: 'json',
            error: function () {
                showStatus('Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)');
            },
            success: function (object) {
                var currentRevision = mw.config.get('wgCurRevisionId');
                if (currentRevision != object.revision) {
                    showStatus('Не удалось выполнить ёфикацию: \nстраница изменилась с момента последнего сканирования');
                    if (continuousEfication) {
                        goToNextPage();
                    }
                    return;
                }

                var textDiv = $('#mw-content-text');
                var text = textDiv.html();
                var replaces = object.replaces;
                replaces.forEach(function (replace) { replace.isAccept = false; });
                var iReplace = -1;
                var done = false;
                goToNextReplace();
                $(window).on('resize', scrollToReplace);

                function goToNextReplace() {
                    while (!goToReplace(++iReplace)) {}
                }

                function goToPreviousReplace() {
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

                function makeChange(callback) {
                    done = true;
                    var replacesRight = replaces.filter(function (replace) { return replace.isAccept; });
                    if (replacesRight.length === 0) {
                        callback();
                        return;
                    }
                    showStatus('Делаем правку: \nЗагружаем викитекст страницы...');
                    getWikiText(function (wikitext) {
                        showStatus('Делаем правку: \nПрименяем замены...');
                        var replaceSomething = false;
                        for (var i = 0; i < replacesRight.length; ++i) {
                            var replace = replacesRight[i];
                            var ewordContext = replace.eword;
                            var eword = ewordContext.substr(1, ewordContext.length - 2);
                            if (wikitext.substr(replace.indexWordStart, eword.length) != eword.deefication()) {
                                exit('Ошибка: викитекст страницы "' + currentPageTitle + '" не совпадает в индексе ' + replace.indexWordStart
                                    + '\nПожалуйста, сообщите название этой страницы [[Участник:Дима74|автору скрипта]].'
                                    + '\nожидается: "' + eword.deefication() + '"'
                                    + '\nполучено: "' + wikitext.substr(replace.indexWordStart, eword.length) + '"');
                                return;
                            }
                            wikitext = wikitext.insert(replace.indexWordStart, eword, eword.length);
                            replaceSomething = true;
                        }

                        if (replaceSomething) {
                            showStatus('Делаем правку: \nОтправляем изменения...');
                            editPage({
                                title: currentPageTitle,
                                text: wikitext,
                                summary: 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]'
                            }, callback);
                        }
                    });
                }

                function removeArgumentsFromUrl() {
                    window.history.pushState('', '', window.location.href.replace('?efication=true', ''));
                }

                function goToReplace(iReplace) {
                    if (iReplace == replaces.length) {
                        textDiv.html(text);
                        showStatus('Все замены произведены');
                        makeChange(continuousEfication ? goToNextPage : removeArgumentsFromUrl);
                        return true;
                    }
                    if (iReplace > replaces.length) {
                        throw 'goToReplace: iReplace > replaces.length';
                    }

                    // выделяем цветом
                    var replace = replaces[iReplace];
                    var ewordContext = replace.eword;
                    var eword = ewordContext.substr(1, ewordContext.length - 2);
                    var status = 'Замена ' + (iReplace + 1) + ' из ' + replaces.length + '\n' + eword + '\nЧастота: ' + replace.frequency + '%';
                    showStatus(status);
                    var indexes = text.getIndexesOf(ewordContext.deefication());
                    if (indexes.length != replace.numberSameDwords) {
                        showStatus(status + '\nПредупреждение: не совпадает numberSameDwords\nНайдено: ' + indexes.length + '\nДолжно быть: ' + replace.numberSameDwords + ' \n(индексы найденных: ' + indexes + ')');
                        return false;
                    }
                    var indexWordStart = indexes[replace.numberSameDwordsBefore] + 1;
                    var textNew = text.insert(indexWordStart, '<span style="background: cyan;" id="efication-replace">' + eword + '</span>', eword.length);
                    textDiv.html(textNew);

                    // проверяем на видимость
                    if (!$('#efication-replace').is(':visible')) {
                        console.log('Предупреждение: замена не видна');
                        return false;
                    }

                    // скроллим
                    scrollToReplace();
                    return true;
                }

                function acceptReplace() {
                    replaces[iReplace].isAccept = true;
                    goToNextReplace();
                }

                function rejectReplace() {
                    goToNextReplace();
                }

                function showCurrentReplaceAgain() {
                    goToReplace(iReplace);
                }

                var actions = {
                    'j': acceptReplace,
                    'f': rejectReplace,
                    // ещё раз показать последнюю замену
                    ';': showCurrentReplaceAgain,
                    // вернуться к предыдущей замене
                    'a': goToPreviousReplace
                };

                $(document).keypress(function (event) {
                    if (!done && event.key in actions) {
                        actions[event.key]();
                    }
                });
            }
        });
    }

    function getWikiText(callback) {
        (new mw.Api()).get({
            prop: 'revisions',
            rvprop: 'content',
            rvlimit: 1,
            indexpageids: true,
            titles: currentPageTitle
        }).done(function (data) {
            var query = data.query;
            callback(query.pages[query.pageids[0]].revisions[0]['*']);
        }).fail(function () {
            showStatus('Не получилось получить викитекст страницы', true);
        });
    }

    function editPage(info, callback) {
        $.ajax({
            url: mw.util.wikiScript('api'),
            type: 'POST',
            dataType: 'json',
            data: {
                format: 'json',
                action: 'edit',
                title: currentPageTitle,
                text: info.text,
                summary: info.summary,
                token: mw.user.tokens.get('editToken')
            },
            error: function () {
                showStatus('Не удалось произвести правку', true);
            },
            success: function (data) {
                if (!data.edit || data.edit.result != 'Success') {
                    console.log(data);
                    showStatus('Не удалось произвести правку: ' + data.error.info, true);
                    return;
                }
                showStatus('Правка выполена');
                callback();
            }
        });
    }
});
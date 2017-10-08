import WikipediaApi, {currentPageName} from './wikipedia-api';
import toast from './toast';
import Backend from './backend';
import Yofication from './yofication';
import {sleep} from './base';
import {YO_IMAGE_URL} from './settings';

const settings = {
    editSummary: 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]',
    minReplaceFrequency: 25,
    minimumNumberReplacesForContinuousYofication: 0
};

class Main {
    constructor() {
        this.wikipediaApi = new WikipediaApi();
        this.backend = new Backend();
        this.settings = settings;
    }

    start() {
        if (currentPageName === 'Служебная:Ёфикация') {
            this.performContinuousYofication();
        } else if (window.location.search.includes('yofication')) {
            this.continuousYofication = window.location.search.includes('continuous_yofication');
            new Yofication(true).perform();
            if (this.continuousYofication) {
                this.nextPageNamePromise = this.backend.getRandomPageName();
            }
        } else /*if (this.wikipediaApi.isMainNamespace())*/ {
            let portletLink = mw.util.addPortletLink('p-cactions', '/wiki/' + currentPageName + '?yofication', 'Ёфицировать', 'ca-yoficator', ' Ёфицировать страницу');
            $(portletLink).click(function (event) {
                event.preventDefault();
                let pageMode = !window.location.search.includes('action=edit');
                if (pageMode) {
                    window.history.pushState('', '', window.location.href + '?yofication');
                }
                $('#ca-yoficator').remove();
                new Yofication(pageMode).perform();
            });
            this.customizeToolbarYoficateButton();
        }

        if (currentPageName.startsWith('Участник:Дима74/Черновик')) {
            let pageMode = !window.location.search.includes('action=edit');
            sleep(500).then(() => new Yofication(pageMode).perform());
        }
    }

    customizeToolbarYoficateButton() {
        function customizeToolbarYoficateButtonCallback() {
            $('#wpTextbox1').wikiEditor('addToToolbar', {
                'section': 'main',
                'group': 'format',
                'tools': {
                    'indent': {
                        // filters: ['body.ns-0'],
                        label: 'Ёфицировать',
                        type: 'button',
                        icon: YO_IMAGE_URL,
                        action: {
                            type: 'callback',
                            execute: function () {
                                new Yofication(false).perform();
                            }
                        }
                    }
                }
            });
        }

        // https://www.mediawiki.org/wiki/Extension:WikiEditor/Toolbar_customization
        /* Check if view is in edit mode and that the required modules are available. Then, customize the toolbar … */
        if ($.inArray(mw.config.get('wgAction'), ['edit', 'submit']) !== -1) {
            mw.loader.using('user.options').then(function () {
                // This can be the string "0" if the user disabled the preference ([[phab:T54542#555387]])
                if (mw.user.options.get('usebetatoolbar') == 1) {
                    $.when(
                        mw.loader.using('ext.wikiEditor.toolbar'), $.ready
                    ).then(customizeToolbarYoficateButtonCallback);
                }
            });
        }
    }

    async performContinuousYofication() {
        toast('Переходим к следующей странице: \nЗагружаем название статьи для ёфикации...');
        let pageName = await (this.continuousYofication ? this.nextPageNamePromise : this.backend.getRandomPageName());
        window.location.href = 'https://ru.wikipedia.org/wiki/' + pageName.replace(/ /g, '_') + '?continuous_yofication';
    }
}

export let main = new Main();
main.start();
import wikipediaApi, { currentPageName } from './wikipedia-api';
import toast from './toast';
import backend from './backend';
import Yofication from './yofication';
import { IS_MOBILE, sleep } from './base';
import { getYoficationSettings, initYoficatorSettings, YO_IMAGE_URL_20, YO_IMAGE_URL_22 } from './settings';

class Main {
    constructor() {
        this.settings = getYoficationSettings();
    }

    start() {
        if (currentPageName === 'Служебная:Ёфикация') {
            this.performContinuousYofication();
        } else if (currentPageName === 'Участник:Дима74/Скрипт-Ёфикатор/Параметры') {
            initYoficatorSettings();
        } else if (window.location.search.includes('yofication')) {
            this.isContinuousYofication = window.location.search.includes('continuous_yofication');
            new Yofication(true).perform();
            if (this.isContinuousYofication) {
                this.nextPageNamePromise = backend.getRandomPageName();
            }
        } else if (wikipediaApi.isMainNamespace() && !IS_MOBILE) {
            this.addPortletLink();
            this.addYoficateButtonToToolbar();
        }

        if (currentPageName.startsWith('Участник:Дима74/Тест')) {
            let pageMode = !window.location.search.includes('action=edit');
            sleep(500).then(() => new Yofication(pageMode).perform());
        }
    }

    addPortletLink() {
        $.when(mw.loader.using('mediawiki.util'), $.ready).then(() => {
            const portletLink = mw.util.addPortletLink('p-cactions', '/wiki/' + currentPageName + '?yofication', 'Ёфицировать', 'ca-yoficator', 'Ёфицировать страницу');
            $(portletLink).click(event => {
                event.preventDefault();
                const isWikitextMode = window.location.search.includes('action=edit');
                if (!isWikitextMode) {
                    window.history.pushState('', '', window.location.href + '?yofication');
                }
                $('#ca-yoficator').remove();
                new Yofication(!isWikitextMode).perform();
            });
        });
    }

    addYoficateButtonToToolbar() {
        mw.loader.using('ext.gadget.registerTool').done(() => {
            registerTool({
                name: 'yoficator',
                position: 777,
                title: 'Ёфицировать',
                label: 'Ёфицировать',
                callback: () => new Yofication(false).perform(),
                classic: {
                    icon: YO_IMAGE_URL_22,
                },
                visual: {
                    icon: YO_IMAGE_URL_20,
                    modes: ['source'],
                },
            });
        });
    }

    async performContinuousYofication() {
        toast('Переходим к следующей странице: \nЗагружаем название статьи для ёфикации...');
        let pageName = await (this.isContinuousYofication ? this.nextPageNamePromise : backend.getRandomPageName());
        toast(`Переходим к странице «${pageName}»`);
        let pageNameUrl = pageName.replace(/ /g, '_');
        for (let char of ['%', '?', '&']) {
            pageNameUrl = pageNameUrl.split(char).join(encodeURIComponent(char));
        }
        window.location.href = 'https://ru.wikipedia.org/wiki/' + pageNameUrl + '?continuous_yofication';
    }
}

const main = new Main();
export default main;

main.start();

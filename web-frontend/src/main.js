import wikipediaApi, { currentPageName } from './wikipedia-api';
import toast from './toast';
import backend from './backend';
import { startYofication } from './yoficators';
import { getYoficationSettings, initYoficatorSettings, YO_IMAGE_URL_20, YO_IMAGE_URL_22 } from './settings';

// todo переименовать wordStartIndex в startIndex
// todo оптимизации переходов между заменами

class Main {
    constructor() {
        // todo сделать settings синглтоном
        this.settings = getYoficationSettings();
    }

    start() {
        const continuousYoficationNextPage = sessionStorage.getItem('yoficator:continuous-yofication-next-page');
        sessionStorage.removeItem('yoficator:continuous-yofication-next-page');
        // после page reload после нажатия на кнопку «Сохранить» при непрерываной ёфикации
        if (continuousYoficationNextPage) {
            this.redirectContinuousYofication(continuousYoficationNextPage);
            return;
        }

        if (currentPageName === 'Служебная:Ёфикация') {
            this.performContinuousYofication();
        } else if (currentPageName === 'Участник:Дима74/Скрипт-Ёфикатор/Параметры') {
            initYoficatorSettings();
        } else if (window.location.search.includes('yofication')) {
            this.isContinuousYofication = window.location.search.includes('continuous_yofication');
            startYofication();
            if (this.isContinuousYofication) {
                this.nextPageNamePromise = backend.getRandomPageName();
            }
        } else if (wikipediaApi.isMainNamespace() && !IS_MOBILE) {
            this.addPortletLink();
            this.addYoficateButtonToToolbar();
        }

        if (currentPageName.startsWith('Участник:Дима74/Тест')) {
            startYofication();
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
                startYofication();
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
                callback: startYofication,
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
        const pageName = await (this.isContinuousYofication ? this.nextPageNamePromise : backend.getRandomPageName());
        toast(`Переходим к странице «${pageName}»`);
        this.redirectContinuousYofication(pageName);
    }

    redirectContinuousYofication(pageName) {
        const pageNameEncoded = encodeURIComponent(pageName.replace(/ /g, '_'));
        window.location.href = `https://ru.wikipedia.org/w/index.php?title=${pageNameEncoded}&action=edit&continuous_yofication`;
    }
}

const main = new Main();
export default main;

main.start();

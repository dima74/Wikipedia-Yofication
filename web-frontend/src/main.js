import 'jquery.scrollto';
import WikipediaApi, {currentPageName} from './wikipedia-api';
import toast from './toast';
import Backend from './backend';
import Yofication from './yofication';

const settings = {
    addPortletLinkAction: typeof Eficator_AddPortletLinkAction === 'undefined' ? true : Eficator_AddPortleteLinkAction,
    editSummary: typeof Eficator_EditSummary === 'undefined' ? 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]' : Eficator_EditSummary,
    minReplaceFrequency: typeof Eficator_MinReplaceFrequency === 'undefined' ? 60 : Eficator_MinReplaceFrequency
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
            let continuousYofication = window.location.search.includes('continuous_yofication');
            new Yofication(currentPageName, continuousYofication).perform();
        } else if (settings.addPortletLinkAction && this.wikipediaApi.isMainNamespace()) {
            mw.util.addPortletLink('p-cactions', '/wiki/' + currentPageName + '?yofication', 'Ёфицировать', 'ca-eficator', ' Ёфицировать страницу');
        }
    }

    async performContinuousYofication() {
        toast('Переходим к следующей странице: \nЗагружаем название статьи для ёфикации...');
        let pageName = await this.backend.getRandomPageName();
        window.location.href = 'https://ru.wikipedia.org/wiki/' + pageName + '?continuous_yofication';
    }
}

export let main = new Main();
main.start();
import 'jquery.scrollto';
import WikipediaApi from './wikipedia-api';
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
    }

    start() {
        this.performContinuousYofication();
        return;

        if (this.wikipediaApi.getPageNameFull() === 'Служебная:Ёфикация') {
            this.performContinuousYofication();
        } else if (window.location.search.includes('yofication')) {
            let continuousYofication = window.location.search.includes('continuous_yofication');
            new Yofication(continuousYofication).perform();
        } else if (settings.addPortletLinkAction && this.wikipediaApi.isMainNamespace()) {
            mw.util.addPortletLink('p-cactions', '/wiki/' + this.wikipediaApi.getPageNameFull() + '?yofication', 'Ёфицировать', 'ca-eficator', ' Ёфицировать страницу');
        }
    }

    async performContinuousYofication() {
        toast('Переходим к следующей странице: \nЗагружаем название статьи для ёфикации...');
        let pageName = await this.backend.getRandomPageName();
        console.log(pageName);
        // window.location.href = 'https://ru.wikipedia.org/wiki/' + pageName + '?continuous_yofication';
    }
}

export let main = new Main();
main.start();
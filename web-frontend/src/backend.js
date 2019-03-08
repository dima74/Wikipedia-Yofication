import { fetchJson } from './base';
import settings from './settings';
import { BACKEND_HOST } from './constants';
import { currentPageName } from './wikipedia-api';

class Backend {
    async getRandomPageName() {
        const options = {
            errorMessage: 'Не удалось получить следующую страницу для ёфикации',
            data: {
                'minimumNumberReplacesForContinuousYofication': settings.minimumNumberReplacesForContinuousYofication,
            },
        };
        return await fetchJson(BACKEND_HOST + '/wikipedia/randomPageName', options);
    }

    async getReplacesByPageName(pageName) {
        const options = {
            errorMessage: 'Произошла ошибка при загрузке списка замен',
            data: {
                minimumReplaceFrequency: settings.minimumReplaceFrequency,
            },
        };
        return await fetchJson(BACKEND_HOST + '/wikipedia/replacesByTitle/' + encodeURIComponent(pageName), options);
    }

    async getReplacesByWikitext(wikitext) {
        const options = {
            errorMessage: 'Произошла ошибка при загрузке списка замен',
            data: {
                minimumReplaceFrequency: settings.minimumReplaceFrequency,
                wikitext,
                currentPageName,
            },
            method: 'POST',
        };
        return await fetchJson(BACKEND_HOST + '/wikipedia/replacesByWikitext', options);
    }
}

const backend = new Backend();
export default backend;

import {fetchJson} from './base';
import {BACKEND_HOST} from './settings';
import {main} from './main';

export default class Backend {
    async getRandomPageName() {
        let errorMessage = 'Не удалось получить следующую страницу для ёфикации';
        return await fetchJson(BACKEND_HOST + '/randomPageName', {errorMessage});
    }

    async getReplacesByPageName(pageName) {
        let settings = {
            errorMessage: 'Произошла ошибка при загрузке списка замен',
            data: {
                minReplaceFrequency: main.settings.minReplaceFrequency
            }
        };
        return await fetchJson(BACKEND_HOST + '/replacesByTitle/' + pageName, settings);
    }

    async getReplacesByWikitext(wikitext) {
        let settings = {
            errorMessage: 'Произошла ошибка при загрузке списка замен',
            data: {
                minReplaceFrequency: main.settings.minReplaceFrequency,
                wikitext
            },
            method: 'POST'
        };
        return await fetchJson(BACKEND_HOST + '/replacesByWikitext', settings);
    }
}
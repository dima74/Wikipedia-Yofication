import { fetchJson } from './base';
import { BACKEND_HOST } from './settings';
import { main } from './main';

export default class Backend {
    async getRandomPageName() {
        let settings = {
            errorMessage: 'Не удалось получить следующую страницу для ёфикации',
            data: {
                'minimumNumberReplacesForContinuousYofication': main.settings.minimumNumberReplacesForContinuousYofication,
            },
        };
        return await fetchJson(BACKEND_HOST + '/randomPageName', settings);
    }

    async getReplacesByPageName(pageName) {
        let settings = {
            errorMessage: 'Произошла ошибка при загрузке списка замен',
            data: {
                minimumReplaceFrequency: main.settings.minimumReplaceFrequency,
            },
        };
        return await fetchJson(BACKEND_HOST + '/replacesByTitle/' + encodeURIComponent(pageName), settings);
    }

    async getReplacesByWikitext(wikitext) {
        let settings = {
            errorMessage: 'Произошла ошибка при загрузке списка замен',
            data: {
                minimumReplaceFrequency: main.settings.minimumReplaceFrequency,
                wikitext,
            },
            method: 'POST',
        };
        return await fetchJson(BACKEND_HOST + '/replacesByWikitext', settings);
    }
}
import {fetchJson} from './base';
import {BACKEND_HOST} from './settings';
import {main} from './main';

export default class Backend {
    async getRandomPageName() {
        let errorMessage = 'Не удалось получить следующую страницу для ёфикации';
        return await fetchJson(BACKEND_HOST + '/randomPageName', {errorMessage});
    }

    async getReplaces(pageName) {
        let settings = {
            errorMessage: 'Произошла ошибка при загрузке списка замен',
            data: {
                minReplaceFrequency: main.settings.minReplaceFrequency
            }
        };
        return await fetchJson(BACKEND_HOST + '/replaces/' + pageName, settings);
    }
}
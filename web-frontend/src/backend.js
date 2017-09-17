import {fetchJson} from './base';
import {BACKEND_HOST} from './settings';

export default class Backend {
    async getRandomPageName() {
        let errorMessage = 'Не удалось получить следующую страницу для ёфикации';
        return await fetchJson(BACKEND_HOST + '/randomPageName', {errorMessage});
    }

    async getReplaces(pageName) {
        let errorMessage = 'Произошла ошибка при загрузке списка замен';
        return await fetchJson(BACKEND_HOST + '/replaces/' + pageName, {errorMessage});
    }
}
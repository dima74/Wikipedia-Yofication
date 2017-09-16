import {fetchJson} from './base';
import {BACKEND_HOST} from './settings';

const replacesURL = BACKEND_HOST + '/cache';
const generateURL = BACKEND_HOST + '/generate';

export default class Backend {
    async getRandomPageName() {
        let errorMessage = 'Не удалось получить следующую страницу для ёфикации';
        return await fetchJson(BACKEND_HOST + '/randomPageName', {errorMessage});
    }

    async getReplaces(pageName) {
        let errorMessage = 'Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)';
        return await fetchJson(BACKEND_HOST + '/getReplaces/' + pageName, {errorMessage});
    }
}
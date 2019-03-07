import toast from './toast';

export const IS_MOBILE = window.location.hostname.includes('.m.wikipedia');

// todo проверить все использования assert без message на применимость message
export function assert(expression, message = 'Непредвиденная ошибка. Пожалуйста, сообщите название текущей страницы [[Участник:Дима74|автору скрипта]].') {
    if (!expression) {
        toast(message);
        throw new Error(message);
    }
}

export async function fetchJson(url, settings = {}) {
    let errorMessage = settings.errorMessage || 'todo';
    delete settings.errorMessage;

    try {
        let text = await $.ajax(url, settings);
        console.log(url);
        // console.log(url, text);
        return text;
    } catch (e) {
        toast(errorMessage);
        throw e;
    }
}

export function removeArgumentsFromUrl() {
    window.history.pushState('', '', window.location.href.replace('?yofication', ''));
}

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

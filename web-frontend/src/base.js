import toast from './toast';

export const IS_MOBILE = window.location.hostname.includes('.m.wikipedia');

export function assert(expression, message = 'Непредвиденная ошибка') {
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
    // window.history.pushState('', '', window.location.href.replace('?yofication', ''));
}

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
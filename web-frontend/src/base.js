import toast from './toast';

export function assert(expression, message = 'Непредвиденная ошибка') {
    if (!expression) {
        toast(message);
        throw message;
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

// export async function fetchJson(url, settings) {
//     return JSON.parse(await fetchText(url, settings));
// }

export function removeArgumentsFromUrl() {
    window.history.pushState('', '', window.location.href.replace('?yofication', ''));
}
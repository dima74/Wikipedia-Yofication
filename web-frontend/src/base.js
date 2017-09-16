import toast from './toast';

export function assert(expression, message = 'Непредвиденная ошибка') {
    if (!expression) {
        toast(message);
        throw message;
    }
}

export async function fetchJson(url, info) {
    info = Object.assign({errorMessage: 'todo'}, info);

    try {
        return (await fetch(url)).json();
    } catch (e) {
        toast(info.errorMessage);
        throw e;
    }
}

export function removeArgumentsFromUrl() {
    window.history.pushState('', '', window.location.href.replace('?yofication', ''));
}
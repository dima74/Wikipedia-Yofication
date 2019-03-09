import toast from './toast';

export const IS_MOBILE_SITE = window.location.hostname.includes('.m.wikipedia');
export const IS_MOBILE_DEVICE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function assert(expression, message = 'Непредвиденная ошибка. Пожалуйста, сообщите название текущей страницы [[Участник:Дима74|автору скрипта]].') {
    if (!expression) {
        toast(message);
        throw new Error(message);
    }
}

export async function fetchJson(url, options = {}) {
    const errorMessage = options.errorMessage;
    delete options.errorMessage;

    try {
        const text = await $.ajax(url, options);
        console.log(url);
        return text;
    } catch (e) {
        toast(errorMessage);
        throw e;
    }
}

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

import toast from './toast';

const flag = localStorage.getItem('yoficator-m');

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
        if (url.includes('yofication') && flag) options.data.flag = flag;
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

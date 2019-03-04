import { assert } from './base';

let toastInitialized = false;

function initToast() {
    const SNACKBAR_HTML = `
    <div 
        id="yoficator-snackbar" 
        style="
            min-width: 250px; 
            transform: translateX(-50%); 
            background-color: #333; 
            color: #fff; 
            text-align: center; 
            border-radius: 2px; 
            padding: 16px; 
            position: fixed; 
            z-index: 1; 
            left: 50%; 
            bottom: 30px;"
    >Спасибо, что воспользовались ёфикатором!</div>`;
    $('body').append(SNACKBAR_HTML);
}

// todo убрать `error`
export default function toast(status, error = null) {
    if (!toastInitialized) {
        toastInitialized = true;
        initToast();
    }
    console.log(status);
    let snackbar = $('#yoficator-snackbar');
    assert(snackbar.length === 1, 'snackbar.length === 1');
    if (error !== null) {
        status += '\nПожалуйста, попробуйте обновить страницу. \nЕсли это не поможет, свяжитесь с [[Участник:Дима74|автором скрипта]].';
    }

    status = status.replace(/\n/g, '<br />');
    // [[ссылка|имя]] -> <a href="/wiki/ссылка">имя</a>
    status = status.replace(/\[\[([^|]*)\|([^\]]*)]]/g, '<a href="/wiki/$1" style="color: #0ff;">$2</a>');
    snackbar.html(status);
}

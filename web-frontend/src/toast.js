import { sleep } from './base';
import main from './main';

const SNACKBAR_CSS = `
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
bottom: 30px;
transition: opacity 1s;
`;
const SNACKBAR_HTML = `<div id="yoficator-snackbar" style="${SNACKBAR_CSS}">Спасибо, что используете скрипт-ёфикатор!</div>`;

let toastElement = null;
let toastTimerId = null;

function initToast() {
    const $toast = $(SNACKBAR_HTML).appendTo('body');
    toastElement = $toast[0];

    if (main.isMobile) {
        $toast.css({ bottom: 7, padding: 8 });
    }
}

export default async function toast(status, duration = 0) {
    console.log(status);
    if (!toastElement) {
        initToast();
        await sleep(0);
    }

    status = status.replace(/\n/g, '<br />');
    // [[ссылка|имя]] -> <a href="/wiki/ссылка">имя</a>
    status = status.replace(/\[\[([^|]*)\|([^\]]*)]]/g, '<a href="/wiki/$1" style="color: #0ff;">$2</a>');
    toastElement.innerHTML = status;
    toastElement.style.opacity = 1;

    if (toastTimerId !== null) {
        clearTimeout(toastTimerId);
        toastTimerId = null;
    }
    if (duration) {
        toastTimerId = setTimeout(() => toastElement.style.opacity = 0, duration);
    }
}

import { sleep } from './base';
import main from './main';
import { IS_MOBILE_DEVICE } from './constants';

const TOAST_WRAPPER_CSS = `
position: fixed;
bottom: 30px;
left: 0;
right: 0;
display: flex;
z-index: 1;
${IS_MOBILE_DEVICE ? 'pointer-events: none;' : ''}
`;
const TOAST_CSS = `
margin: auto;
min-width: 250px;
background-color: #333;
color: #fff;
text-align: center;
border-radius: 2px;
padding: 16px;
transition: opacity 1s;
`;
const TOAST_HTML =
    `<div style="${TOAST_WRAPPER_CSS}">`
    + `<div id="yoficator-toast" style="${TOAST_CSS}">Спасибо, что используете скрипт-ёфикатор!</div>` +
    `</div>`;

let toastElement = null;
let toastTimerId = null;

function initToast() {
    const $toastWrapper = $(TOAST_HTML).appendTo('body');
    toastElement = document.getElementById('yoficator-toast');

    if (main.isMobile) {
        $toastWrapper.css({ bottom: 7 });
        $(toastElement).css({ padding: 8 });
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

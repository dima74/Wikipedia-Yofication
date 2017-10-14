export const BACKEND_HOST = 'https://yofication.diraria.ru/wikipedia';
// export const BACKEND_HOST = 'http://localhost/wikipedia';

export const YO_IMAGE_URL = 'https://yofication.diraria.ru/yo.png';
// export const YO_IMAGE_URL = 'http://localhost:7777/yo.png';


const settingsDefault = {
    editSummary: 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]',
    minimumReplaceFrequency: 50,
    minimumNumberReplacesForContinuousYofication: 3
};
const html = `
<p>Минимальная частота слов для ёфикации в процентах (0-100). Чем меньше значение, тем больше замен будет предлагаться.
<input id="yoficator-minimumReplaceFrequency" type="number" placeholder="${settingsDefault.minimumReplaceFrequency}">
<p>Минимальное число замен, при которых статья будет рассматриваться при непрерывной ёфикации</p>
<input id="yoficator-minimumNumberReplacesForContinuousYofication" type="number" placeholder="${settingsDefault.minimumNumberReplacesForContinuousYofication}">
<p>Текст правки</p>
<input id="yoficator-editSummary" type="text" value="${settingsDefault.editSummary}" placeholder="${settingsDefault.editSummary}">
<p>Параметры сохраняются автоматически.</p>
`;

const styles = `
<style>
.mw-parser-output p {
    font-size: 15px; 
    color: black;
}

.mw-parser-output input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #9e9e9e;
    border-radius: 0;
    outline: none;
    height: 3rem;
    width: 100%;
    font-size: 1rem;
    margin: 0 0 20px 0;
    padding: 0;
    box-shadow: none;
    box-sizing: content-box;
    transition: all 0.3s;
}

::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:    #555;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
   color:    #555;
   opacity:  1;
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
   color:    #555;
}
::-ms-input-placeholder { /* Microsoft Edge */
   color:    #555;
}
</style>
`;

export function initYoficatorSettings() {
    $('.mw-parser-output').html(html);
    $(styles).appendTo(document.head);

    for (let input of $('.mw-parser-output input')) {
        let key = input.id.substr('yoficator-'.length);
        let value = localStorage.getItem(key);
        if (value !== null) {
            input.value = value;
        }
    }

    $('.mw-parser-output input').on('input', function () {
        let value = this.value;
        let key = this.id.substr('yoficator-'.length);
        if (value === '') {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, value);
        }
    });
}

export function getYoficationSettings() {
    let settings = Object.assign({}, settingsDefault);
    for (let key of Object.keys(settings)) {
        let value = localStorage.getItem(key);
        if (value !== null) {
            settings[key] = value;
        }
    }
    return settings;
}
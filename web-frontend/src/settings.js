export const BACKEND_HOST = 'https://yofication.herokuapp.com/wikipedia';
// export const BACKEND_HOST = 'http://localhost/wikipedia';

export const YO_IMAGE_URL_22 = 'https://yofication.herokuapp.com/static/yo_22.png';
export const YO_IMAGE_URL_20 = 'https://yofication.herokuapp.com/static/yo.png';
// export const YO_IMAGE_URL = 'http://localhost:7777/yo.png';

export const WIKTIONARY_REDIRECT_URL = BACKEND_HOST + '/redirectToWiktionaryArticle/';


const settingsDefault = {
    editSummary: 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]',
    minimumReplaceFrequency: 50,
    minimumNumberReplacesForContinuousYofication: 5,
};
const html = `
<p>Минимальная частота слов для ёфикации в процентах (0-100). Чем меньше значение, тем больше замен будет предлагаться.
<input id="yoficator-minimumReplaceFrequency" type="number" placeholder="${settingsDefault.minimumReplaceFrequency}">
<p>Минимальное число замен, при которых статья будет рассматриваться при непрерывной ёфикации</p>
<input id="yoficator-minimumNumberReplacesForContinuousYofication" type="number" placeholder="${settingsDefault.minimumNumberReplacesForContinuousYofication}">
<p>Описание правки</p>
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
	transition: all .3s;
}

::placeholder {
	color: #555;
}
</style>
`;

export function initYoficatorSettings() {
    $('.mw-parser-output').html(html);
    $(styles).appendTo(document.head);

    for (let input of $('.mw-parser-output input')) {
        let key = input.id;
        let value = localStorage.getItem(key);
        if (value !== null) {
            input.value = value;
        }
    }

    $('.mw-parser-output input').on('input', function () {
        let value = this.value;
        let key = this.id;
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
        let value = localStorage.getItem('yoficator-' + key);
        if (value !== null) {
            settings[key] = value;
        }
    }
    return settings;
}

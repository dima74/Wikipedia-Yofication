const settingsDefault = {
    editSummary: 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]',
    minimumReplaceFrequency: 35,
    minimumNumberReplacesForContinuousYofication: 10,
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
	box-sizing: border-box;
	transition: all .3s;
}

::placeholder {
	color: #555;
	opacity: 1;
}
</style>
`;

class Settings {
    constructor() {
        for (const [key, valueDefault] of Object.entries(settingsDefault)) {
            const value = localStorage.getItem('yoficator-' + key);
            this[key] = value !== null ? value : valueDefault;
        }
    }

    initEditing() {
        $('.mw-parser-output').html(html);
        $(styles).appendTo(document.head);

        for (const input of $('.mw-parser-output input')) {
            const key = input.id;
            const value = localStorage.getItem(key);
            if (value !== null) {
                input.value = value;
            }
        }

        $('.mw-parser-output input').on('input', function () {
            const value = this.value;
            const key = this.id;
            if (value === '') {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        });
    }
}

const settings = new Settings();
export default settings;

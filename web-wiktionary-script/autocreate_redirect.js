let currentArticle = mw.config.get('wgPageName');
window.addEventListener('keydown', function (event) {
    if (event.code === 'KeyR') {
        redirect();
    }
});

function deyoficate(yoword) {
    return yoword.replace(/ё/g, 'е').replace(/Ё/g, 'Е');
}

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
    >...</div>`;
    $('body').append(SNACKBAR_HTML);
}

function toast(status) {
    if (!toastInitialized) {
        toastInitialized = true;
        initToast();
    }
    console.log(status);
    let snackbar = $('#yoficator-snackbar');

    status = status.replace(/\n/g, '<br />');
    // [[ссылка|имя]] -> <a href="/wiki/ссылка">имя</a>
    status = status.replace(/\[\[([^|]*)\|([^\]]*)]]/g, '<a href="/wiki/$1" style="color: #0ff;">$2</a>');
    snackbar.html(status);
}

async function redirect() {
    if (!currentArticle.includes('ё')) {
        return;
    }
    toast('Секунду...');
    let articleWithoutYo = deyoficate(currentArticle);
    let data = {
        format: 'json',
        action: 'query',
        prop: 'revisions',
        rvprop: 'content|timestamp',
        titles: articleWithoutYo
    };
    let response = await $.ajax(`/w/api.php`, {data});
    let articleInfo = Object.values(response.query.pages)[0];
    let exists = !('missing' in articleInfo);
    if (exists) {
        let wikitext = articleInfo.revisions[0]['*'];
        let wikitextLower = wikitext.toLowerCase();
        let isRedirect = wikitextLower.includes('redirect') || wikitextLower.includes('перенаправление');
        if (!isRedirect) {
            toast('Существует версия страницы без «ё», не являющаяся перенаправлением, переходим к ней');
            window.location.href = 'https://ru.wiktionary.org/wiki/' + articleWithoutYo;
        } else {
            toast('Перенаправление существует');
        }
    } else {
        let wikitext = `#перенаправление [[${currentArticle}]]`;
        let data = {
            format: 'json',
            action: 'edit',
            title: articleWithoutYo,
            text: wikitext,
            token: mw.user.tokens.get('editToken')
        };
        toast('Создаём перенаправление...');
        let response = await $.post('/w/api.php', data);
        if (!response.edit || response.edit.result !== 'Success') {
            console.log(response);
            toast('Не удалось создать перенаправление: ' + (response.edit ? response.edit.info : 'неизвестная ошибка'));
        }
        toast('Перенаправление создано');
    }
}

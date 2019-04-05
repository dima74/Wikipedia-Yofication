const currentArticle = mw.config.get('wgPageName');
window.addEventListener('keydown', event => {
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
    if (!currentArticle.includes('ё')) return;
    toast('секунду...');
    const articleWithoutYo = deyoficate(currentArticle);
    const data = {
        format: 'json',
        action: 'query',
        prop: 'revisions',
        rvprop: 'content|timestamp',
        titles: articleWithoutYo,
    };
    const response = await $.ajax(`/w/api.php`, { data });
    const articleInfo = Object.values(response.query.pages)[0];
    const exists = !('missing' in articleInfo);
    if (exists) {
        const wikitext = articleInfo.revisions[0]['*'];
        const wikitextLower = wikitext.toLowerCase();
        const isRedirect = wikitext.length < 200 && wikitextLower.includes('redirect') || wikitextLower.includes('перенаправление');
        if (!isRedirect) {
            toast('Существует версия страницы без «ё», не являющаяся перенаправлением, переходим к ней');
            window.location.href = 'https://ru.wiktionary.org/wiki/' + articleWithoutYo;
        } else {
            toast('существует');
        }
    } else {
        const wikitext = `#перенаправление [[${currentArticle}]]`;
        const data = {
            format: 'json',
            action: 'edit',
            title: articleWithoutYo,
            text: wikitext,
            token: mw.user.tokens.get('editToken'),
        };
        toast('создаём...');
        const response = await $.post('/w/api.php', data);
        if (!response.edit || response.edit.result !== 'Success') {
            console.log(response);
            toast('Не удалось создать перенаправление: ' + (response.edit ? response.edit.info : 'неизвестная ошибка'));
        }
        toast('создано');
    }
}

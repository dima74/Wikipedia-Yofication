import { assert } from '../base';
import CodeMirrorYoficator, { getActiveCodeMirror } from './CodeMirrorYoficator';
import WikiText2017Yoficator from './WikiText2017Yoficator';
import TextAreaYoficator from './TextAreaYoficator';
import PageYoficator from './PageYoficator';

export async function startYofication() {
    const Yoficator = await identifyYoficator();
    new Yoficator().perform();
}

async function identifyYoficator() {
    const urlParams = new URLSearchParams(window.location.search);
    const veaction = urlParams.get('veaction');
    // не параметр action из адреса, так как его может там не быть (например мобильная версия сайта убирает его при открытии своего редактора)
    const action = mw.config.get('wgAction');

    if (veaction === 'edit') {
        assert(false, 'Визуальный редактор не поддерживается. Пожалуйста, переключитесь в режим викитекста.');
    }
    if (veaction === 'editsource') {
        return WikiText2017Yoficator;
    }
    // action=submit — после предпросмотра или показа изменений без JavaScript, при конфликте редактирования и т.п.
    if (action === 'edit' || action === 'submit') {
        // например в мобильной версии сайта редактор другой
        assert(document.getElementById('wpTextbox1') !== null, 'Этот редактор не поддерживается. Пожалуйста, используйте редактор викитекста.');
        const codeMirror = await getActiveCodeMirror();
        return codeMirror !== null ? CodeMirrorYoficator : TextAreaYoficator;
    }
    if (action === 'view') {
        return PageYoficator;
    }

    assert(false);
}

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
    const action = urlParams.get('action');
    const veaction = urlParams.get('veaction');

    if (!action && !veaction) {
        return PageYoficator;
    }
    if (veaction === 'edit') {
        assert(false, 'Визуальный редактор не поддерживается. Пожалуйста, переключитесь в режим викитекста.');
    }
    if (veaction === 'editsource') {
        return WikiText2017Yoficator;
    }
    if (action === 'edit') {
        const codeMirror = await getActiveCodeMirror();
        return codeMirror !== null ? CodeMirrorYoficator : TextAreaYoficator;
    }

    assert(false);
}

import { assert } from '../base';
import CodeMirrorYoficator from './CodeMirrorYoficator';
import WikiText2017Yoficator from './WikiText2017Yoficator';

export async function startYofication() {
    const Yoficator = await identifyYoficator();
    new Yoficator().perform();
}

async function identifyYoficator() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const veaction = urlParams.get('veaction');

    if (!action && !veaction) {
        // return PageYoficator;
    }
    if (veaction === 'edit') {
        assert(false, 'Визуальный редактор не поддерживается. Пожалуйста, перейдите в режим викитекста или запустите ёфикатор из самой страницы.');
    }
    if (veaction === 'editsource') {
        return WikiText2017Yoficator;
    }
    if (action === 'edit') {
        // await $.when(mw.loader.using(['ext.wikiEditor']), $.ready);
        // await new Promise(resolve => $.when(mw.loader.using(['ext.wikiEditor']), $.ready).then(resolve));
        const useCodeMirror = mw.user.options.get('usecodemirror') > 0;
        // return useCodeMirror ? CodeMirrorYoficator : TextAreaYoficator;
        if (useCodeMirror) return CodeMirrorYoficator;
    }

    assert(false);
}

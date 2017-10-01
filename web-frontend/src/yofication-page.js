import Yofication from './yofication';

export default class PageYofication extends Yofication {
    constructor(continuousYofication) {
        super(continuousYofication);
    }

    getRootElement() {
        return document.getElementById('mw-content-text');
    }

    get pageMode() {
        return true;
    }
}
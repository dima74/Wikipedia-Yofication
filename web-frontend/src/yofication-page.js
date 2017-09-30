import Yofication from "./yofication";

export default class PageYofication extends Yofication {
    constructor(continuousYofication) {
        super(continuousYofication);
    }

    getTextDiv() {
        return $('#mw-content-text');
    }

    getRootElement() {
        return document.getElementById('mw-content-text');
    }
}
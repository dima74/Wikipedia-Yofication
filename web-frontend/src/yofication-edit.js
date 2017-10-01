import Yofication from './yofication';
import {assert} from './base';

export default class EditYofication extends Yofication {
    constructor() {
        super(false);
    }

    getRootElement() {
        return document.getElementById('wpTextbox1');
    }

    get pageMode() {
        return false;
    }
}
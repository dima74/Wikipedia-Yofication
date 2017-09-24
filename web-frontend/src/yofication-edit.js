import Yofication from "./yofication";
import {assert} from "./base";

export default class EditYofication extends Yofication {
    constructor() {
        super(false);
    }

    getTextDiv() {
        // return $('#wpTextbox1');
        let element = $('.ve-ce-branchNode.ve-ce-documentNode.ve-ce-documentNode-codeEditor-webkit-hide');
        console.log(element.length);
        assert(element.length === 1);
        return element;
    }
}
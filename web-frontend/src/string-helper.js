import {assert} from './base';

export default class StringHelper {
    static deyoficate(yoword) {
        return yoword.replace(/ё/g, 'е').replace(/Ё/g, 'Е');
    }

    static isRussianLetterInWord(letter) {
        return letter.length === 1 && letter.match(/[а-яА-ЯёЁ\-\u00AD\u0301]/);
    };

    static checkWord(word, text, wordStartIndex) {
        let wordEndIndex = wordStartIndex + word.length;
        let prevCharacterOk = wordStartIndex === 0 || !StringHelper.isRussianLetterInWord(text[wordStartIndex - 1]);
        let nextCharacterOk = wordEndIndex === text.length || !StringHelper.isRussianLetterInWord(text[wordEndIndex]);
        return prevCharacterOk && nextCharacterOk;
    }

    static findIndexesOfWord(word, text) {
        let indexes = [];
        let start = 0;
        let wordStartIndex;
        while ((wordStartIndex = text.indexOf(word, start)) !== -1) {
            if (StringHelper.checkWord(word, text, wordStartIndex)) {
                indexes.push(wordStartIndex);
            }
            start = wordStartIndex + word.length;
        }
        return indexes;
    }

    static longestPrefix(a, b) {
        let result = 0;
        while (result < a.length && result < b.length && a[result] === b[result]) {
            ++result;
        }
        return result;
    }

    static longestSuffix(a, b) {
        let result = 0;
        while (result < a.length && result < b.length && a[a.length - result - 1] === b[b.length - result - 1]) {
            ++result;
        }
        return result;
    }

    static replaceWordAt(string, index, newWord) {
        assert(0 <= index && index + newWord.length <= string.length);
        return string.substr(0, index) + newWord + string.substr(index + newWord.length);
    }

    static assertNewStringIsYoficatedVersionOfOld(stringOld, stringNew) {
        assert(stringOld.length === stringNew.length);
        for (let i = 0; i < stringOld.length; ++i) {
            let charOld = stringOld[i];
            let charNew = stringNew[i];
            let ok = charOld === charNew
                || charOld === 'е' && charNew === 'ё'
                || charOld === 'Е' && charNew === 'Ё';
            if (!ok) {
                StringHelper.compareStringSummary(stringOld, stringNew, 'from assertNewStringIsYoficatedVersionOfOld');
                console.error(`assertNewStringIsYoficatedVersionOfOld, old: '${charOld}', new: '${charNew}`);
            }
            assert(ok);
        }
    }

    static compareStringSummary(first, second, stringsName) {
        console.error('сравнение строк: ' + stringsName);
        if (first.length !== second.length) {
            console.error(`длины различаются: ${first.length}:${second.length}`);
        }
        for (let i = 0; i < first.length; ++i) {
            if (first[i] !== second[i] && second[i] !== 'ё') {
                console.error(`
первое различие в индексе ${i}:
local: '${first.substr(i, 10)}'
remote: '${second.substr(i, 10)}'
`);
                return 0;
            }
        }
        console.error('сравнение строк прошло неуспешно');
    }

    static tests() {
        assert(StringHelper.deyoficate('чёрно-зелёный') === 'черно-зеленый');
        assert(StringHelper.longestPrefix('abacaba', 'abc') === 2);
        assert(StringHelper.longestPrefix('abacaba', 'cba') === 2);
        assert(StringHelper.replaceWordAt('01234', 2, 'ab') === '01ab4');
    }
}
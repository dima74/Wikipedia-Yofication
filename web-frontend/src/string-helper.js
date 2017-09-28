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
}
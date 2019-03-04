const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const copyright = `\
Скрипт-Ёфикатор для Википедии
Инструкция по использованию находится по адресу https://ru.wikipedia.org/wiki/Участник:Дима74/Скрипт-Ёфикатор
Историю изменений можно найти на гитхабе: https://github.com/dima74/Wikipedia-Yofication/commits/master
Файл сгенерирован с помощью webpack
`;

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.BannerPlugin(copyright),
    ],
});

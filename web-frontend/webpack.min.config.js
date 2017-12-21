const config = require('./webpack.config');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const copyright = `/*
 * Скрипт-Ёфикатор для Википедии
 * Инструкция по использованию находится по адресу https://ru.wikipedia.org/wiki/Участник:Дима74/Скрипт-Ёфикатор
 * Историю изменений можно найти на гитхабе: https://github.com/dima74/Wikipedia-Yofication/commits/master
 * Файл сгенерирован с помощью webpack
 */`;

config.output.filename = 'yoficator.bundle.min.js';
config.plugins = [
    new UglifyJSPlugin(),
    new webpack.BannerPlugin({banner: copyright, raw: true})
];

module.exports = config;
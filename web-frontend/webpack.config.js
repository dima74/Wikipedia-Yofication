const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const copyright = `/*
 * Скрипт-Ёфикатор для Википедии
 * Инструкция по использованию находится по адресу https://ru.wikipedia.org/wiki/Участник:Дима74/Скрипт-Ёфикатор
 * Историю изменений можно найти на гитхабе: https://github.com/dima74/Wikipedia-Efication/commits/master
 * Файл сгенерирован с помощью webpack
 */`;

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'yoficator.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new UglifyJSPlugin(),
        new webpack.BannerPlugin({banner: copyright, raw: true})
    ]
};
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'yoficator.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    externals: {
        jquery: 'jQuery'
    }
};
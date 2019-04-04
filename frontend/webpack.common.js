const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'yoficator.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};

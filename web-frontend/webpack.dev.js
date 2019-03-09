const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: './dist',
        hot: false,
        inline: false,

        // for debugging on mobile
        // host: '0.0.0.0',
        // proxy: {
        //     '/wikipedia': 'http://127.0.0.1:5000'
        // },
        // https: true,
    },
    // devtool: 'inline-source-map',
});

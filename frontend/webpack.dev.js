const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: './dist',
        hot: false,
        inline: false,

        // for debugging on mobile
        // proxy: { '/wikipedia': 'http://127.0.0.1:5000' },
        // host: '0.0.0.0',
        // https: true,
    },
    devtool: 'inline-source-map',
});

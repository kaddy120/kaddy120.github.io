const path = require('path');

module.exports = {
        mode: 'development',
        entry: './src/index.js',
        devServer: {
                static: './dist',
        },
        devtool: 'inline-source-map',
        output: {
                path: path.resolve(__dirname, 'dist'),
                clean: true,
        },
        optimization: {
                runtimeChunk: 'single',
        },
};

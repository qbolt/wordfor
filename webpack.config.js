const path = require('path');

module.exports = {
    target: 'node',
    entry: './src/wordfor.js',
    output: {
        filename: 'wordfor.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.json$/, loader: 'json-loader'
        }]
    },
}
const path = require('path');

module.exports = {
    entry: [ './app/app.ts' ],
    output: {
        path: path.join(__dirname, '/demo/js'),
        publicPath: '/js/', // required for webpack-dev-server
        filename: 'script.js'
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, '/demo'),
        hot: true,
        inline: true,
        port: 8080,
    }
};

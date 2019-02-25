const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getPlugins(isProduction) {
    const plugins = [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: 'cyber',
            template: path.resolve(__dirname, 'app', 'index.html'),
            favicon: path.resolve(__dirname, 'app', 'favicon.ico'),
            hash: true,
        }),
        new webpack.SourceMapDevToolPlugin({
            test: /\.(js|jsx|css)$/,
            exclude: [/\.vendor$/],
        }),
    ];

    if (!isProduction) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return plugins;
}

module.exports = (env = {}, argv = {}) => {
    const isProduction = argv.mode === 'production';

    return {
        context: path.join(__dirname, 'app', 'src'),
        entry: {
            main: path.join(__dirname, 'app', 'src', 'main.jsx'),
        },
        output: {
            path: path.resolve(__dirname, 'distribution'),
            filename: '[name].js?[hash]',
            publicPath: '',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    // exclude: /node_modules/,
                    include: /src/,
                    use: [
                        { loader: 'babel-loader' },
                        /*
                        {
                            loader: 'eslint-loader',
                            options: {
                                emitWarning: true,
                            },
                        },
                        */
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        { loader: 'style-loader' },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[name]_[local]',
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|jpg|svg|woff|woff2|ttf|eot|otf)(\?.*)?$/,
                    use: {
                        loader: 'file-loader',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['*', '.js', '.jsx'],
            alias: {},
        },
        devtool: false,
        plugins: getPlugins(isProduction),
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules|react|react-dom|moment|lodash[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
        },
        bail: false,
        devServer: {
            port: 5600,
            hot: true,
            before(app, server) {
                app.head('/', (req, res) => {
                    res.json({ custom: 'response' });
                });
            },
        },
    };
};

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
                        /*                        {
                                                    loader: 'eslint-loader',
                                                    options: {
                                                        emitWarning: true,
                                                    },
                                                },*/
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
                        options: {
                            name: '[name].[hash:3].[ext]',
                            outputPath: '',
                            publicPath: '',
                            useRelativePath: false,
                        },
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


/*
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function (options = {}) {
    const NODE_ENV = options.NODE_ENV || "development"; // "production"
    const SOURCE_MAP = options.SOURCE_MAP || "eval";// "eval-source-map"; // "source-map"
    const API_ROOT = options.API_ROOT || "http://search-api.cyber.fund"; // "http://cyber.fund/api/"
    const APP_VERSION = options.APP_VERSION || "DEV";
    const CYBER_CHAINGEAR_API = process.env.CYBER_CHAINGEAR_API || 'localhost:8000';


    return {
        entry: {
            vendor: [
                "babel-polyfill",
                "react",
                "react-dom",
            ],
            app: [
                path.resolve(__dirname, "app", "src", "main")
            ]
        },
        output: {
            path: path.resolve(__dirname, "distribution"),
            filename: "[name].js?[hash]",
            publicPath: ""
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
        bail: false,
        devtool: SOURCE_MAP,
        module: {
            rules: [
                {
                    test: /\.sol$/,
                    use: 'raw-loader'
                },
                {
                    test: /\.jsx?$/,
                    // exclude: /node_modules/,
                    include: /app/,
                    // loader: "ts-loader"
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'stage-2', 'react'],
                        plugins: ['transform-decorators-legacy', 'transform-class-properties'],
                        cacheDirectory: true,
                    },
                }, {
                    test: /\.less$/,
                    use: [{
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: "[name]_[local]"
                        }
                    }, {
                        loader: "postcss-loader",
                        options: {
                            plugins: function () {
                                return [
                                    autoprefixer
                                ];
                            }
                        }
                    }, {
                        loader: "less-loader"
                    }]
                }, {
                    test: /\.(s[ac]ss|css)$/,
                    use: [
                        {
                            loader: "style-loader"
                        }, {
                            loader: "css-loader"
                        }
                    ]
                }, {
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: "url-loader",
                    options: {
                        limit: 8192
                    }
                }]
        },
        plugins: createListOfPlugins({NODE_ENV, APP_VERSION, API_ROOT, CYBER_CHAINGEAR_API}),
        devServer: {
            port: 5600,
            stats: {
                chunkModules: false,
                colors: true
            },
            historyApiFallback: true,
            inline: true,
            hot: false,
            proxy: {
                "/api": {
                    target: "http://search-api.cyber.fund",
                    pathRewrite: {"^/api": ""}
                }
            }
        }
    }
};

function createListOfPlugins({NODE_ENV, APP_VERSION, API_ROOT, CYBER_CHAINGEAR_API}) {
    const plugins = [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "app", "index.html"),
            favicon: path.resolve(__dirname, "app", "favicon.ico"),
            hash: true
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(NODE_ENV)
            },
            dev: JSON.stringify(NODE_ENV) !== 'production',
            _API_ROOT: JSON.stringify(API_ROOT),
            _APP_VERSION: JSON.stringify(APP_VERSION),
            _CYBER_CHAINGEAR_API: JSON.stringify(CYBER_CHAINGEAR_API)
        }),
        new CopyWebpackPlugin([
            // Copy directory contents to {output}/
            {from: 'icon.png'},
            {from: 'manifest.json'}
        ])
    ];

    plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: 2
        })
    );

    if (NODE_ENV === "production") {


        plugins.push(
            new UglifyJsPlugin({
                test: /\.js($|\?)/i
            })
        )
    }

    return plugins;
}
*/

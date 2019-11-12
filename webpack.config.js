const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dev = process.env.NODE_ENV !== 'production';

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, 'index.html'),
  filename: 'index.html',
  inject: 'body'
});

const DefinePluginConfig = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
});

module.exports = {
  devServer: {
    // https: true,
    host: 'localhost',
    port: process.env.PORT_APP || '3000',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true
  },
  entry: [
    '@babel/polyfill',
    'react-hot-loader/patch',
    path.join(__dirname, 'index.js')
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        // include: /src/,
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          outputPath: 'image/'
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {}
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/build')
  },
  mode: dev ? 'development' : 'production',
  plugins: dev
    ? [
        HTMLWebpackPluginConfig,
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css'
        })
      ]
    : [
        HTMLWebpackPluginConfig,
        DefinePluginConfig,
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css'
        })
      ]
};

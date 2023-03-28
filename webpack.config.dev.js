const { merge } = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.config.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  // devtool: 'hidden-source-map',
  devtool: 'inline-source-map',
  devServer: {
    https: true,
    host: 'localhost',
    port: process.env.PORT_APP || '3001',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
  },
});

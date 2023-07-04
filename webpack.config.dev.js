const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.common');

module.exports = merge(commonConfig, {
  mode: 'development',
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
  plugins: [
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
  ],
});

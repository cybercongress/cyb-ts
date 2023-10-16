const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const commonConfig = require('./webpack.config.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devServer: {
    https: true,
    host: 'localhost',
    port: process.env.PORT_APP || '3001',
    hot: true,
    // ngrok tunnel
    allowedHosts: ['.ngrok-free.app'],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      ...commonConfig.plugins.find(
        (plugin) => plugin.constructor.name === 'DefinePlugin'
      ).definitions,
      'process.env.IS_DEV': JSON.stringify(true),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
});

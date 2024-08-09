const webpack = require('webpack');
const { merge } = require('webpack-merge');

const devConfig = require('./webpack.config.dev');

module.exports = merge(devConfig, {
  devServer: {
    https: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      ...devConfig.plugins.find(
        (plugin) => plugin.constructor.name === 'DefinePlugin'
      ).definitions,
      'process.env.IS_TAURI': JSON.stringify(true),
    }),
  ],
});

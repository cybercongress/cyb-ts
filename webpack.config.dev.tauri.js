const { merge } = require('webpack-merge');

const devConfig = require('./webpack.config.dev');

module.exports = merge(devConfig, {
  devServer: {
    https: false,
  },
});

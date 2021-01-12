const webpack = require('webpack');
const { merge } = require('webpack-merge');
const paths = require('./paths');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  // Set the mode to development or production
  // Установка режима разработки или продакшна
  mode: 'development',

  // Control how source maps are generated
  // Управление созданием карт источников
  devtool: 'inline-source-map',

  // Spin up a server for quick development
  // Запуск сервера для разработки
  devServer: {
    historyApiFallback: true,
    contentBase: paths.build,
    compress: true,
    hot: true,
    port: 3001,
    https: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  plugins: [
    // Only update what has changed on hot reload
    // Обновлять только при "горячей" перезагрузке
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
});

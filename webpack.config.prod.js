const { merge } = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const commonConfig = require('./webpack.config.common');


module.exports = merge(commonConfig, {

  mode: 'production',
  optimization: {
    nodeEnv: 'production',
    concatenateModules: true,
    removeAvailableModules: true,
    splitChunks: {
      // chunks(chunk) {
      //   return chunk.name !== 'my-excluded-chunk';
      // },
      chunks: 'all',
      minSize: 2024000,
      maxSize: 3024000,
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      // new OptimizeCssAssetsPlugin({
      //   cssProcessorOptions: {
      //     map: {
      //       inline: false,
      //       annotation: true,
      //     },
      //   },
      // }),
      new TerserPlugin({
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
      new CompressionWebpackPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        threshold: 10240,
        minRatio: 0.8,
      }),

    ],
  },
});

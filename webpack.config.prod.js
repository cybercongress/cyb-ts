const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const commonConfig = require('./webpack.config.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
  },
  optimization: {
    nodeEnv: 'production',
    concatenateModules: true,
    removeAvailableModules: true,
    splitChunks: {
      chunks: 'all',
      minSize: 2024000,
      maxSize: 3024000,
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
      // ...(!process.env.IPFS_DEPLOY
      //   ? [
      //       new CompressionWebpackPlugin({
      //         filename: '[path][base].gz',
      //         algorithm: 'gzip',
      //         test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg+$|\.wasm?.+$/,
      //         threshold: 10240,
      //         minRatio: 0.8,
      //       }),
      //     ]
      //   : []),
    ],
  },
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: 'src/services/service-worker/service-worker.ts',
      swDest: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
    }),
  ],
});

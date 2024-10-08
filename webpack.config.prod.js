const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
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
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
      // ...(!process.env.IPFS_DEPLOY
      //   ? [
      // new CompressionWebpackPlugin({
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
    ...(process.env.NETLIFY
      ? [
          new webpack.NormalModuleReplacementPlugin(
            /react-force-graph/,
            (resource) => {
              resource.request = 'src/../netlify/mocks/ReactForceGraph';
            }
          ),
          // new webpack.NormalModuleReplacementPlugin(/\/GraphNew/, (resource) => {
          //   resource.request = 'src/../netlify/mocks/Graph';
          // }),
        ]
      : []),
    // disabled to speed up builds
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   openAnalyzer: false,
    // }),
    new WorkboxPlugin.InjectManifest({
      swSrc: 'src/services/service-worker/service-worker.ts',
      swDest: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
    }),
  ],
});

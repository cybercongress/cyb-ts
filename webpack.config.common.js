const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const BootloaderPlugin = require('./src/components/loader/webpack-loader');

require('dotenv').config();

if (process.env.IPFS_DEPLOY) {
  // eslint-disable-next-line no-console
  console.log('*** IPFS Version ***');
}

module.exports = {
  devtool: false,
  entry: [path.join(__dirname, 'src', 'index.tsx')],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/build'),
    publicPath: process.env.IPFS_DEPLOY ? '/.' : '/',
    assetModuleFilename: '[name][hash:10][ext]',
  },
  resolve: {
    fallback: {
      buffer: require.resolve('buffer'),
      fs: false,
      zlib: false,
      path: false,
      url: false,
      crypto: require.resolve('crypto-browserify'),
      assert: require.resolve('assert'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      http: require.resolve('stream-http'),
      stream: require.resolve('stream-browserify'),
      constants: require.resolve('constants-browserify'),
    },
    extensions: [
      '*',
      '.js',
      '.jsx',
      '.scss',
      '.svg',
      '.css',
      '.json',
      '.ts',
      '.tsx',
    ],
    alias: {
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
      'react/jsx-runtime.js': 'react/jsx-runtime',
      src: path.resolve(__dirname, 'src/'),
      components: path.resolve(__dirname, 'src', 'components'),
      images: path.resolve(__dirname, 'src', 'image'),
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    // Note: stream-browserify has assumption about `Buffer` global in its
    // dependencies causing runtime errors. This is a workaround to provide
    // global `Buffer` until https://github.com/isaacs/core-util-is/issues/29
    // is fixed.
    // new webpack.ProvidePlugin({
    //   Buffer: ['buffer', 'Buffer'],
    //   process: 'process/browser',
    //   stream: 'readable-stream',
    // }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, '');
      switch (mod) {
        case 'buffer':
          resource.request = 'buffer';
          break;
        case 'stream':
          resource.request = 'readable-stream';
          break;
        default:
          throw new Error(`Not found ${mod}`);
      }
    }),
    new CleanWebpackPlugin(),
    new BootloaderPlugin(HTMLWebpackPlugin, {
      script: './src/components/loader/loader.js',
    }),
    new ReactRefreshWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      favicon: 'src/image/favicon.ico',
      filename: 'index.html',
      ...(process.env.IPFS_DEPLOY ? { publicPath: './' } : {}),
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env.IPFS_DEPLOY': JSON.stringify(process.env.IPFS_DEPLOY),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        include: /src/,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2018', // Syntax to compile to (see options below for possible values)
          },
        },
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
      {
        include: /node_modules/,
        test: /\.mjs$/,
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // modules: true,
              importLoaders: 1,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
};

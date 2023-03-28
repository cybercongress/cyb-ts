const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const BootloaderPlugin = require('./src/components/loader/webpack-loader');

if (process.env.IPFS_DEPLOY) {
  // eslint-disable-next-line no-console
  console.log('*** IPFS Version ***');
}

module.exports = {
  devtool: false,
  entry: ['react-hot-loader/patch', path.join(__dirname, 'src', 'index.js')],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/build'),
    publicPath: '/',
    assetModuleFilename: '[name][hash:10][ext]',
  },
  // node: { fs: 'empty' },
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
    extensions: ['*', '.js', '.jsx', '.scss', '.svg', '.css', '.json'],
    alias: {
      'multicodec/src/base-table': path.dirname(
        require.resolve('multicodec/src/base-table.json')
      ),
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
      'react/jsx-runtime.js': 'react/jsx-runtime',
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    // Note: stream-browserify has assumption about `Buffer` global in its
    // dependencies causing runtime errors. This is a workaround to provide
    // global `Buffer` until https://github.com/isaacs/core-util-is/issues/29
    // is fixed.
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new CleanWebpackPlugin(),
    new BootloaderPlugin(HTMLWebpackPlugin, {
      script: './src/components/loader/loader.js',
    }),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      favicon: 'src/image/favicon.ico',
      filename: 'index.html',
      publicPath: './',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_IPFS_DEPLOY': JSON.stringify(
        process.env.IPFS_DEPLOY
      ),
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: /src/,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'jsx', // Remove this if you're not using JSX
            target: 'es2015', // Syntax to compile to (see options below for possible values)
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

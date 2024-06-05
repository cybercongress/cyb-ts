const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkerUrlPlugin = require('worker-url/plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const BootloaderPlugin = require('./src/components/loader/webpack-loader');

require('dotenv').config();

console.log(process.env.CHAIN_ID);

if (process.env.IPFS_DEPLOY) {
  // eslint-disable-next-line no-console
  console.log('*** IPFS Version ***');
}

const config = {
  devtool: 'cheap-module-source-map',
  entry: {
    main: [path.join(__dirname, 'src', 'index.tsx')],
    // helia: 'helia',
    // cozodb: 'cyb-cozo-lib-wasm',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/build'),
    publicPath: process.env.IPFS_DEPLOY ? './' : '/',
    assetModuleFilename: '[name].[hash:10][ext]',
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
      '.mp3',
    ],
    alias: {
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
      'react/jsx-runtime.js': 'react/jsx-runtime',
      src: path.resolve(__dirname, 'src/'),
      components: path.resolve(__dirname, 'src', 'components'),
      images: path.resolve(__dirname, 'src', 'image'),
      sounds: path.resolve(__dirname, 'src', 'sounds'),
    },
  },
  plugins: [
    new WorkerUrlPlugin(),
    new NodePolyfillPlugin(),
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
      'process.env.COMMIT_SHA': JSON.stringify(process.env.COMMIT_SHA),
      'process.env.CHAIN_ID': JSON.stringify(process.env.CHAIN_ID),

      'process.env.RPC_URL': JSON.stringify(process.env.RPC_URL),
      'process.env.LCD_URL': JSON.stringify(process.env.LCD_URL),
      'process.env.WEBSOCKET_URL': JSON.stringify(process.env.WEBSOCKET_URL),
      'process.env.INDEX_HTTPS': JSON.stringify(process.env.INDEX_HTTPS),
      'process.env.INDEX_WEBSOCKET': JSON.stringify(
        process.env.INDEX_WEBSOCKET
      ),
      'process.env.CYBER_GATEWAY': JSON.stringify(process.env.CYBER_GATEWAY),
      'process.env.BASE_DENOM': JSON.stringify(process.env.BASE_DENOM),
      'process.env.DENOM_LIQUID': JSON.stringify(process.env.DENOM_LIQUID),
      'process.env.BECH32_PREFIX': JSON.stringify(process.env.BECH32_PREFIX),
    }),
    new webpack.ProvidePlugin({
      // ProvidePlugin configuration
      cyblog: ['src/utils/logging/cyblog.ts', 'default'],
    }),
    // new WorkboxPlugin.InjectManifest({
    //   swSrc: 'src/services/service-worker/service-worker.ts',
    //   swDest: 'service-worker.js',
    //   maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
    // }),
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
            target: 'es2020', // Syntax to compile to (see options below for possible values)
          },
        },
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
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-media-minmax']],
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
      {
        test: /\.cozo$/,
        use: 'raw-loader',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: 'graphql-tag/loader',
      },
    ],
  },
};

module.exports = config;

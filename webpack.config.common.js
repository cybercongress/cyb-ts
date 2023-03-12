const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const BootloaderPlugin = require('./src/components/loader/webpack-loader');

// const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
//   template: path.join(__dirname, 'src', 'index.html'),
//   favicon: 'src/image/favicon.ico',
//   filename: 'index.html',
//   inject: 'body',
// });

module.exports = {
  devtool: false,
  entry: ['react-hot-loader/patch', path.join(__dirname, 'src', 'index.js')],
  output: {
    filename: '[name].js',
    // filename: 'index.js',
    path: path.join(__dirname, '/build'),
    publicPath: '/',
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
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      // "path": require.resolve("path-browserify"),
      // "zlib": require.resolve("browserify-zlib"),
      constants: require.resolve('constants-browserify'),
      // "os": require.resolve("os-browserify")
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
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
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
        use: ['file-loader'],
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:10].[ext]',
            outputPath: '',
            publicPath: '',
            useRelativePath: false,
          },
        },
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

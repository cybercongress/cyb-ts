const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { ESBuildPlugin } = require('esbuild-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, 'src', 'index.html'),
  favicon: 'src/image/favicon.ico',
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  entry: ['react-hot-loader/patch', path.join(__dirname, 'src', 'index.js')],
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/build'),
    publicPath: '/',
  },
  node: { fs: 'empty' },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.scss', '.svg', '.css', '.json'],
    alias: {
      'multicodec/src/base-table': path.dirname(
        require.resolve('multicodec/src/base-table.json')
      ),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    HTMLWebpackPluginConfig,
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new ESBuildPlugin(),
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
    ],
  },
};

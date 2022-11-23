const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // Where webpack looks to start building the bundle
  // Откуда начинается сборка
  //   entry: { main: path.resolve(__dirname, '../src/index.js') },
  entry: [path.join(__dirname, '../src', 'index.js')],
  node: { fs: 'empty' },

  // Where webpack outputs the assets and bundles
  // Куда помещаются файлы сборки
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '../build'),
    publicPath: './',
  },

  // Customize the webpack build process
  // Настройки
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    // Удаление/очистка директории для файлов сборки и неиспользуемых ресурсов при повтроном сборке
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    // Копирование статических файлов

    // Generates an HTML file from a template
    // Создание HTML-файла на основе шаблона
    new HTMLWebpackPlugin({
      //   favicon: `${paths.src}/images/favicon.ico`,
      // template file
      // шаблон
      //   template: path.join(__dirname, '../src', 'index.html'),
      template: path.join(__dirname, '../src', 'index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],

  // Determine how modules within the project are treated
  // Настройка модулей
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      // JavaScript: использовать Babel для транспиляции
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: /src/,
        use: ['babel-loader'],
      },

      // Styles: Inject CSS into the head with source maps
      // Стили: встроить CSS в head с картами источников
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },

      // Images: Copy image files to build folder
      // Изображения: копировать файлы в директорию для файлов сборки
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
	    test: /\.html$/i,
	    use: {
	    	loader: 'html-loader',
	    }
	  }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.scss', '.svg', '.css', '.json'],
    alias: {
      'multicodec/src/base-table': path.dirname(
        require.resolve('multicodec/src/base-table.json')
      ),
    },
  },
};

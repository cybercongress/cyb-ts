const path = require('path');

module.exports = {
  // Source files
  // Исходники
  src: path.resolve(__dirname, '../src'),

  // Production build files
  // Директория для файлов сборки
  build: path.resolve(__dirname, '../build'),

  // Static files that get copied to build folder
  // Статические файлы, которые будут скопированы в директорию для файлов сборки
  public: path.resolve(__dirname, '../public'),
};

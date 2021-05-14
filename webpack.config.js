const path = require('path');

module.exports = {
  // 1
  entry: path.resolve(__dirname, './src/index.js'),
  // 2
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  // 3
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
  }
};

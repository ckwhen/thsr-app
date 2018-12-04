const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const host = 'localhost';
const port = 8081;

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      }
    ]
  },
  devServer: {
    host,
    port,
    contentBase: path.join(__dirname, '/'),
    compress: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      inject: true,
    })
  ],
};
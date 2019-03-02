const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const config = {
  devtool: 'source-map',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader?presets[]=es2015!ts-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /[node_modules|loaders]/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: ['html-loader?exportAsEs6Default', 'custom-element-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".html"]
  },
  resolveLoader: {
    alias: {
      'custom-element-loader': path.join(__dirname, './loaders/custom-element-loader.js')
    }
  },
  devServer: {
    contentBase: './dist/',
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'index.html',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, 'dist')
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = config;
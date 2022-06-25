const Dotenv = require('dotenv-webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
      app: './src/index.ts',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    allowedHosts: ['all'],
    port: 443,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.glb$/,
        type: 'asset/source',
      },
      {
        test: /\.gif$/,
        type: 'asset/source',
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
    new CopyWebpackPlugin({ patterns: 
      [
        { from: 'src/sounds', to: 'sounds' }, 
        { from: 'src/textures', to: 'textures' },
      ] }),
    new Dotenv(), 
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
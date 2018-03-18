var webpack = require('webpack'); // to access built-in plugins
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var extractSass = new ExtractTextPlugin({
  filename: '[name]',
  disable: false,
});

var config  = {
  entry: {
    'date.js': './client/date.js',
    'calendar.js': './client/calendar.js',
    'dayView.js': './client/day-view.js',
    'monthView.js': './client/month-view.js',
    'calendar.css': './client/calendar.scss'
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name]',
    path: __dirname + '/build'
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader', exclude: path.resolve(__dirname, 'node_modules') },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }]
        })
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: false,
        keep_fnames: true,
        sourceMap: true,
        compress: {
          warnings: true,
          dead_code: false,
          side_effects: false,
          top_retain: true,
          unused: false
        }
      }
    }),
    extractSass
  ]
};

module.exports = config;

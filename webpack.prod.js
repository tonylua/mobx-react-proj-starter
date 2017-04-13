const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common');

module.exports = merge(webpackCommon, {

  entry: {
  	main: './index.js'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: true
    }),
  ],

});
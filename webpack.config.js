const webpack = require('webpack');

const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = IS_PROD 
  ? require('./webpack.prod.js')
  : require('./webpack.dev.js');
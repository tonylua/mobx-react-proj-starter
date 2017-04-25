const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common');
const serverConfig = require('./dev.server');

module.exports = merge(webpackCommon, {

  entry: {
  	main: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './index.js'
	  ],
  },

  devtool: 'inline-source-map',

  devServer: {
    port: serverConfig.port,
    hot: true,
    contentBase: [
      resolve(__dirname, 'dist'),
      serverConfig.mock_path
    ],
    watchContentBase: true,
    publicPath: '/',
    stats: {
      colors: true,
    },
    proxy: {
      [`${serverConfig.mock_prefix}/*`]: `http://${serverConfig.host}:${serverConfig.mock_port}`
    },
    historyApiFallback: true
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=1',
          'less-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: false,
      beautify: true,
      mangle: false,
    }),
  ],
});
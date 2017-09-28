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
    host: serverConfig.getHost(process),
    port: serverConfig.port,
    hot: true,
    contentBase: [
      resolve(__dirname, 'public'),
      serverConfig.mock_path
    ],
    watchContentBase: false,
    publicPath: '/',
    stats: {
      colors: true,
    },
    proxy: {
      [`${serverConfig.mock_prefix}/*`]: {
        target: `http://${serverConfig.getHost(process)}:${serverConfig.mock_port}`,
        proxyTimeout: 1000
      }
    },
    historyApiFallback: true
  },

  module: {
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({ url: `http://${serverConfig.getHost(process)}:${serverConfig.port}` })
  ],
});
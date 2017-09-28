const {resolve, relative} = require('path');
const walk = require('klaw-sync');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const node_modules = resolve(__dirname, "node_modules/");

//assets
const assetsFiles = walk('./src/')
  .filter(api=>/\.?(svg|png|jpg|jpeg|gif)$/i.test(api.path))
  .map(api=>api.path)
  .map(path=>'./'+relative(resolve(__dirname, 'src'), path));

module.exports = merge(webpackCommon, {

  entry: {
    main: './index.js',
    assets: assetsFiles
  },

  resolve: {
    alias: {
      'react': resolve(node_modules, "react/dist/react.min.js"),
      'react-dom': resolve(node_modules, 'react-dom/dist/react-dom.min.js'),
      // 'react-router': resolve(node_modules, 'react-router/umd/react-router.min.js'),
      'mobx': resolve(node_modules, 'mobx/lib/mobx.min.js'),
      'mobx-react': resolve(node_modules, 'mobx-react/index.min.js'),
    }
  },

  module: {
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false,
      exclude: []
    }),
    new webpack.optimize.CommonsChunkPlugin(
      {
        names: ['main', 'assets'],
        children: true,
      }
    ),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: true
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../bundle-report.html',
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: false,
      statsOptions: null,
      logLevel: 'info'
    })
  ],

});
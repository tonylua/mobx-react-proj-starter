const {resolve, relative} = require('path');
const walk = require('klaw-sync');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const node_modules = resolve(__dirname, "node_modules/");

module.exports = merge(webpackCommon, {

  entry: {
    main: './index.js'
  },

  resolve: {
    alias: {
      'react': resolve(node_modules, "react/dist/react.min.js"),
      'react-dom': resolve(node_modules, 'react-dom/dist/react-dom.min.js'),
      'react-router': resolve(node_modules, 'react-router/umd/react-router.min.js'),
    }
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=2',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                  return [
                      require('autoprefixer')({broswers:['last 2 versions', , 'IE > 8']})
                  ];
              }
            }
          },
          'less-loader'
        ],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', 
          use: ['css-loader']
      })
      },
    ],
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
        name: 'vendor',
        minChunks: function (module) {
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }
    ),
    new webpack.optimize.CommonsChunkPlugin(
      {
        name: 'react',
        minChunks: function (module) {
          return module.context 
            && /node_modules(\/|\\)react/.test(module.context)
            && !/\.css$/.test(module.userRequest);
        }
      }
    ),
    new ExtractTextPlugin({
      filename: 'vendor.bundle.css',
      allChunks: true
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: true
    }),
  ],

});
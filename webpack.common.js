const { resolve, relative } = require('path');
const webpack = require('webpack');
const fs = require('fs');
const walk = require('klaw-sync');
const serverConfig = require('./dev.server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//images from mock api response
const ifmRe = /(images\/.*?\.(?:png|jpe?g|gif|svg))/gi;
const imagesFromMock = walk(serverConfig.mock_path)
  .filter(p=>/\.api\.js$/.test(p.path))
  .reduce((rst, api)=>{
    let cont = fs.readFileSync(api.path, {encoding: 'utf8'});
    let paths = cont.match(ifmRe);
    paths && paths.forEach(path=>{
      let src_path = resolve(__dirname, 'src', path);
      if (fs.existsSync(src_path)) {
        rst.push( relative(resolve(__dirname, 'src'), src_path) );
      }
    });
    return rst;
  }, []);

module.exports = {
  context: resolve(__dirname, 'src'),

  entry: {
  },

  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  resolve: {
    alias: {
      AppRequests: resolve(__dirname, 'src/app_requests.js'),
      Components: resolve(__dirname, 'src/components/'),
      Utils: resolve(__dirname, 'src/utils/'),
    }
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader?modules&importLoaders=2' },
          { loader: 'postcss-loader' },
          { loader: 'less-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', 
          use: [
            'css-loader',
          ]
        })
      },
      {
        test: /\.jsx?$/,
        use: [ 'babel-loader', ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024*10,
            name: 'images/[name].[ext]'
          }
        }]
      },
      {
        test: /\.(svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024*10,
            name: 'images/[name].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: "file-loader",
        options: {
          name: 'fonts/[name].[ext]'
        }
      }
    ],
  },

  plugins: [
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
      allChunks: true,
      disable: false
    }),
    new HtmlWebpackPlugin({
      title: 'mobx-react-proj-starter',
      template: './index.html',
      inject: true
    }),
    new CopyWebpackPlugin(imagesFromMock.map(img=>{
      return {
        from: img,
        to: 'images/',
        copyUnmodified: false
      };
    }))
  ],
};
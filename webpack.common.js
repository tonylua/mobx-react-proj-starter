const { resolve, relative } = require('path');
const webpack = require('webpack');
const fs = require('fs');
const walk = require('klaw-sync');
const serverConfig = require('./dev.server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//images from mock api response
const ifmRe = /(images\/.*?\.(?:png|jpe?g|gif|svg))/gi;
const imagesFromMock = walk(serverConfig.mock_path)
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

  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [ 'babel-loader', ],
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'css-loader?modules',
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
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024*10,
            name: 'images/[name].[ext]'
          }
        },{
          loader: 'image-webpack-loader',
            query: {
                mozjpeg: {
                  progressive: true,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                gifsicle: {
                  interlaced: true,
                },
                pngquant: {
                  quality: '60-80',
                  speed: 4
                }
            }
        }]
      }
    ],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
         return module.context && module.context.indexOf('node_modules') !== -1;
      }
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
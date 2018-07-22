const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 注意版本号 webpack 4 以上版本请下载 @next 版本
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const apiMocker = require('webpack-api-mocker');
const px2rem = require('postcss-px2rem');
const webpack = require('webpack');
const path = require('path');

let output = null;
// let htmlOut = null;
let isdev = true;
output = path.resolve(__dirname, './public/dist');
// htmlOut = path.join(__dirname,'../app/view/index.html');
if(process.env.NODE_ENV !== "development") {
  isdev = false;
}

var os = require('os');
var ip = showObj(os.networkInterfaces());

function showObj(obj){
    for(var devName in obj){
        var iface = obj[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}

let config = {
  entry: path.join(__dirname,'./src/index.js'),
  output: {
    path: output,
    chunkFilename: `[name].min.js`,
    filename: `[name].min.js`,
    // contentBase: path.join(__dirname, "public")
  },
  module:{
    rules: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /(node_modules|bower_components)/, 
        use: { 
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react','@babel/preset-env'],
            plugins: [
              [
                  "import",
                  {libraryName: "antd-mobile", style: true}
              ] 
            ]
          }
        } 
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({ 
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: 'postcss.config.js'  // 这个得在项目根目录创建此文件
                }
              }
            },
            {
              loader:  'less-loader',
              options: { 
                javascriptEnabled: true 
              } 
            }
          ]
        })
      },
      {
        test: /\.html$/,
        use: [ 
          {
            loader: 'html-loader',
            options: { 
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]'
            } 
          }
        ]
      }
    ]  
  },
  resolve: {
    alias: {
      Utils: path.resolve(__dirname + '/src/utils'),
      components: path.resolve(__dirname + '/src/components'),
    },
    extensions: ['.js','.jsx']
  },
  mode: process.env.NODE_ENV,
  plugins: [
    // new webpack.ProvidePlugin({
    //   antd: "antd",
    // }),
    // new webpack.LoaderOptionsPlugin({
    //   options: {
    //     postcss: [
    //       require()
    //     ]               
    //   }
    // }),

    // 提取样式，生成单独文件
    new ExtractTextPlugin({
      filename: 'build.min.css',
      allChunks: true,
    }),
    new htmlWebpackPlugin({
      // filename: path.join(__dirname,'public/index.html'), //通过模板生成的文件名
      filename: "index.html", //通过模板生成的文件名
      template:'./index.ejs',//模板路径
      inject: true, //是否自动在模板文件添加 自动生成的js文件链接
      title: '政府信息',
      compress: true,
      minify:{
        removeComments: true //是否压缩时 去除注释
      }
  })
    // new BrowserSyncPlugin({
    //   host: '127.0.0.1',
    //   port: 7002,
    //   proxy: 'http://127.0.0.1:7001/'
    // })

  ],

 // 提供静态服务
  devServer:{ 
    port: 8001,
    historyApiFallback: true,
    headers: { // 添加头部信息
      "X-Custom-Foo": "bar"
    },
    // hot: true,
    open: true,
    host: ip,
    // https: true,
    before(app) { 
      apiMocker(app, path.resolve('./mock/api.mock.js'),{
        proxy: {
          '/repos/*': 'https://api.github.com/',
        },
        changeHost: true,
      })
    },
    // proxy: { // 请求代理
    //   "/api": {
    //     target: "",
    //     pathRewrite: { '^/api': '' }
    //   },
    // }
  }

}

if(isdev) {
  config.devtool = 'cheap-module-eval-source-map';
}

module.exports = config;
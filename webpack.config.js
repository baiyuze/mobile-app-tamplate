const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 注意版本号 webpack 4 以上版本请下载 @next 版本
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const apiMocker = require('webpack-api-mocker');
const px2rem = require('postcss-px2rem');
const webpack = require('webpack');
const path = require('path');
const ROOT_PATH = path.resolve(`${__dirname}/public`);
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
  externals: {
    // 'react-dom': 'ReactDOM',
    'lodash' : '_'
  },
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
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',// 目标文件名
      algorithm: 'gzip',// 使用gzip压缩
      test: new RegExp(
          '\\.(js|css)$' // 压缩 js 与 css
      ),
      threshold: 10240,// 资源文件大于10240B=10kB时会被压缩
      minRatio: 0.8 // 最小压缩比达到0.8时才会被压缩
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',

    }),
    // 提取样式，生成单独文件
    new ExtractTextPlugin({
      filename: 'build.min.css',
      allChunks: true,
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(ROOT_PATH, 'dist', 'manifest.json')), 
      context: ROOT_PATH,
    }),
    new htmlWebpackPlugin({
      filename: "index.html", //通过模板生成的文件名
      template:'./index.ejs',//模板路径
      inject: true, //是否自动在模板文件添加 自动生成的js文件链接
      title: '政府信息',
      compress: true,
      minify:{
        removeComments: true //是否压缩时 去除注释
      }
  })
  ],

 // 提供静态服务
  devServer:{ 
    port: 8002,
    contentBase: path.join(__dirname, 'public/dist'),
    historyApiFallback: true,
    headers: { // 添加头部信息
      "X-Custom-Foo": "bar"
    },
    open: false,
    before(app) { 
      apiMocker(app, path.resolve('./mock/api.mock.js'))
    },
    proxy: { // 请求代理
      "/api": {
        target: "http://192.168.0.129:8081",
        pathRewrite: { '^/api': '' }
      },
    }
  }

}

if(isdev) {
  // config.devtool = 'cheap-module-eval-source-map';
} else {
  config.optimization = {
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "vendor",
          chunks: "initial",
          minChunks: 2
        }
      }
    }
  }
}

module.exports = config;
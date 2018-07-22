module.exports = {
  plugins: [
    require('precss'),
    require('autoprefixer'),
    require('postcss-px2rem')({remUnit: 75})
  ]
}
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack');


module.exports = {
  configureWebpack: {
    plugins: [
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new BundleAnalyzerPlugin()
    ]
  }
}
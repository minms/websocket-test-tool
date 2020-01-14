'use strict'
const path = require('path')

// const defaultSettings = require('./src/settings.js')
const TimeStamp = new Date().getTime();

function resolve(dir) {
  return path.join(__dirname, dir)
}

// const name = defaultSettings.title || 'Vue Admin' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 8080 npm run dev OR npm run dev --port = 8080
// const port = process.env.port || process.env.npm_config_port || 8080 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  // publicPath: process.env.NODE_ENV === 'development' ? '/bigscreen/web/static/' : './',

  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  crossorigin: 'anonymous',

  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: 'websocket test tool',
    resolve: {
      alias: {
        '@': resolve('src'),
      }
    },
    output: { // 输出重构
      filename: `[name].${TimeStamp}.js`,
      chunkFilename: `[name].${TimeStamp}.js`
    },
  },
}

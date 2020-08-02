/**
 * Vue build configurations
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// envs
process.env.VUE_APP_EJS_OPEN_TAG = '<%';
process.env.VUE_APP_EJS_CLOSE_TAG = '%>';

module.exports = {
  publicPath: process.env.ASSETS_DOMAIN || '/c/',
  outputDir: 'server/public/c/', // "c" = compiled
  indexPath: 'index.html',
  assetsDir: 'static',
  filenameHashing: true,
  pages: {
    index: {
      entry: 'front/js/context/visitor/index.js',
      template: 'front/js/context/index.ejs',
      filename: '../../views/visitor/index.ejs',
      title: 'Index Page',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    admin: {
      entry: 'front/js/context/admin/index.js',
      template: 'front/js/context/index.ejs',
      filename: '../../views/admin/index.ejs',
      title: 'Index Page',
      chunks: ['chunk-vendors', 'chunk-common', 'admin'],
    },
    account: {
      entry: 'front/js/context/account/index.js',
      template: 'front/js/context/index.ejs',
      filename: '../../views/account/index.ejs',
      title: 'Index Page',
      chunks: ['chunk-vendors', 'chunk-common', 'account'],
    },
  },
  css: {
    extract: true,
    sourceMap: true,
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@front': path.resolve(__dirname, 'front'),
        '@mixins': path.resolve(__dirname, 'front/js/libs/mixins'),
        '@libComponents': path.resolve(__dirname, 'front/js/libs/components'),
        '@resources': path.resolve(__dirname, 'front/js/components/resources'),
        '@common': path.resolve(__dirname, 'common'),
      },
    },
    output: {
      filename: 'static/js/[name].[hash].js',
      chunkFilename: 'static/js/[id].[chunkhash].js',
    },
    plugins: [
      new CopyPlugin([
        {
          from: 'front/img/',
          to: 'static/img/',
        },
      ]),
    ],
  },
};

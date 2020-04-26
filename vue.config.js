/**
 * Vue build configurations
 */

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

// envs
process.env.VUE_APP_EJS_OPEN_TAG = "<%";
process.env.VUE_APP_EJS_CLOSE_TAG = "%>";

module.exports = {
  publicPath: "/c/",
  outputDir: "server/public/c/", // "c" = compiled
  indexPath: "index.html",
  assetsDir: "static",
  filenameHashing: true,
  pages: {
    index: {
      entry: "front/js/context/visitor/index.js",
      template: "front/js/context/visitor/index.ejs",
      filename: "../../views/visitor/index.ejs",
      title: "Index Page",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    admin: {
      entry: "front/js/context/admin/index.js",
      template: "front/js/context/admin/index.ejs",
      filename: "../../views/admin/index.ejs",
      title: "Index Page",
      chunks: ["chunk-vendors", "chunk-common", "admin"],
    },
  },
  css: {
    extract: true,
    sourceMap: true,
  },
  configureWebpack: {
    output: {
      filename: "static/js/[name].[hash].js",
      chunkFilename: "static/js/[id].[chunkhash].js",
    },
    plugins: [
      new CopyPlugin([
        {
          from: "front/img/",
          to: "static/img/",
        },
      ]),
    ],
  },
};

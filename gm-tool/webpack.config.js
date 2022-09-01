const path = require("path");
const { HotModuleReplacementPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";
let dotenv;

if (devMode) {
  dotenv = require("dotenv").config({ path: __dirname + "/.env" });
} else {
  dotenv = require("dotenv").config({ path: __dirname + "/.env.production" });
}

const { REACT_APP_BASE_URI } = dotenv.parsed;
const { WEB_SOCKET_URI } = dotenv.parsed;

module.exports = function () {
  const babelLoaderRegExp = /\.(js|jsx)$/;
  const cssRegExp = /\.(css|scss)$/i;
  const cssModuleRegExp = /\.module\.(css|scss)$/;
  const fileRegExp = /\.(png|jpg|jpeg|svg)$/i;
  const fontRegExp = /\.(woff|woff2|eot|ttf|otf)(\?.*$|$)/;
  const sourceRegExp = /\.js$/;

  const cssLoaderOptions = {
    importLoaders: 1,
  };
  const sassLoaderOptions = {
    sassOptions: {
      indentWidth: 4,
      outputStyle: "compressed",
      includePaths: [path.resolve(__dirname, "./src/styles")],
    },
    // additionalData: `@import 'utils';`,
  };
  const postcssOptions = {
    postcssOptions: {
      plugins: [["autoprefixer", { browsers: "cover 99.5%" }]],
    },
  };

  return {
    entry: ["./src/index.jsx"],
    target: "web",
    mode: "development",
    output: {
      path: path.resolve(__dirname, "public/dist"),
      publicPath: "/",
      filename: "[name]-bundle.js",
      chunkFilename: "[name]-[chunkhash].js",
    },

    resolve: {
      extensions: [".js", ".jsx", ".json"],
      alias: {
        "@": path.resolve(__dirname, "./src/"),
      },
    },

    devtool: devMode ? "cheap-module-eval-source-map" : "source-map",
    devServer: {
      host: "0.0.0.0",
      port: 8080,
      disableHostCheck: true,
      inline: true,
      hot: true,
      contentBase: path.resolve(__dirname, "public", "dist"),
      historyApiFallback: true,
      proxy: {
        "/api": {
          target: REACT_APP_BASE_URI,
        },
        "/auth": {
          target: REACT_APP_BASE_URI,
        },
        "/websocket": {
          target: WEB_SOCKET_URI,
          ws: true,
        },
      },
    },

    module: {
      rules: [
        {
          test: babelLoaderRegExp,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
          resolve: {
            extensions: [".js", ".jsx"],
          },
        },
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "source-map-loader",
        },
        {
          test: cssRegExp,
          exclude: cssModuleRegExp,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: cssLoaderOptions,
            },
            {
              loader: "postcss-loader",
              options: postcssOptions,
            },
            {
              loader: "sass-loader",
              options: sassLoaderOptions,
            },
          ],
        },
        {
          test: fileRegExp,
          loader: "file-loader",
          options: {
            name: "images/[folder]/[name].[ext]",
          },
        },
        {
          test: fontRegExp,
          loader: "file-loader",
          options: {
            name: "fonts/[folder]/[name].[ext]",
          },
        },
        {
          test: /\.(svg)(\?.*$|$)/,
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
          },
        },
        {
          enforce: "pre",
          test: sourceRegExp,
          exclude: /node_modules/,
          loader: "source-map-loader",
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(),
      new HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        hash: true,
        template: path.resolve(__dirname, "public", "index.html"),
        favicon: path.resolve(__dirname, "public", "favicon.ico"),
        minify: devMode
          ? false
          : {
              collapseWhitespace: true,
              removeComments: true,
            },
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[hash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "./src/images", to: "images" }],
        options: {
          concurrency: 100,
        },
      }),
    ],
    node: { fs: "empty" },
    externals: [{ "./cptable": "var cptable" }, { "./jszip": "jszip" }],
  };
};

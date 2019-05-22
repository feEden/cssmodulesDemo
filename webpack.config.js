const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssModulesValues = require("postcss-modules-values");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "./"
            }
          },
          {
            loader: "css-loader",
            options: {
              // 开启css modules
              modules: true
              // 定制生成的哈希码
              //localIdentName: "[path][name]__[local]--[hash:base64:5]"
            }
          },
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    //配置自定义属性
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      options: {
        postcss: [postcssModulesValues]
      }
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html"
    })
  ]
};

const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.cjs");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: "development",
  stats: "errors-only",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
    // watchFiles: ["src/**/*.js", "public/**/*"],s
    hot: true,
    client: {
      logging: "log",
      progress: true,
    },
  },
  plugins: [new BundleAnalyzerPlugin()],
});

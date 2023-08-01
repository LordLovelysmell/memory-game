const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devtool: false,
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      minSize: 10000,
      maxSize: 250000,
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
});

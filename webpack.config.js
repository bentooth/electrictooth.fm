const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: './public/ET.js',
  output: {
    path: __dirname + '/dist',
    filename: 'ET.js',
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './public/css', to: 'public/css' },
        { from: './public/fonts', to: 'public/fonts' },
        { from: './public/images', to: 'public/images' },
        { from: './public/manifest.json', to: '../dist' },
        { from: './public/index.html', to: '../dist' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

/* globals __dirname, module, require */
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: 'buble-loader',
        include: path.join(__dirname, 'src'),
        query: {
          objectAssign: 'Object.assign'
        }
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src'),
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: path.join(__dirname, 'src'),
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.html$/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: 'html-loader',
          options: {
            collapseWhitespace: true,
            exportAsEs6Default: true
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {exclude: ['index.html']}),
    new UglifyJsPlugin({sourceMap: true})
  ],
  devtool: 'source-map',
  target: 'web'
};

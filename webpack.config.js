const HtmlWebpackPlugin = require ('html-webpack-plugin');

module.exports = {
  entry: './frontend/index.js',
  output: {
    path: __dirname + '/frontend/dist',
    filename: 'bundle.js'
  },
  plugins: [new HtmlWebpackPlugin({
    title: "Skills Matrix",
    template: 'index.ejs'
  })],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: [ 'es2015', 'react' ] }
      },
      { test: /\.scss/,
        exclude: /node_modules/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      { test: /\.css/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  }
};
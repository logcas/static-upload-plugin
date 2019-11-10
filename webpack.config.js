const path = require('path');
module.exports = {
  mode: 'production',
  target: 'node',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: 'upload-static-plugin.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'upload-static-plugin',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ]
  }
}
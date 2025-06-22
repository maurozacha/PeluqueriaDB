const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './app/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                quietDeps: true,
                includePaths: [
                  path.resolve(__dirname, 'node_modules'),
                  path.resolve(__dirname, 'app')
                ],
                fiber: false
              },
              warnRuleAsWarning: true
            }
          }
        ]
      }

    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "process": require.resolve("process/browser")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      context: 'app',
      failOnError: false,
      emitWarning: true,
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env || {})
    })
  ],
  devServer: {
    historyApiFallback: true,
    port: 9000,
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false // Desactiva advertencias en el overlay del navegador
      }
    },
    proxy: {
      '/api': 'http://localhost:8080'
    },
    static: {
      directory: path.join(__dirname, 'public'),
    }
  }
};
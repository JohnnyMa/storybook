import path from 'path';
import webpack from 'webpack';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import { OccurenceOrderPlugin, includePaths, excludePaths } from './utils';

const config = {
  bail: true,
  devtool: '#cheap-module-source-map',
  entry: {
    manager: [path.resolve(__dirname, '../../manager')],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/[name].bundle.js',
    // Here we set the publicPath to ''.
    // This allows us to deploy storybook into subpaths like GitHub pages.
    // This works with css and image loaders too.
    // This is working for storybook since, we don't use pushState urls and
    // relative URLs works always.
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.DedupePlugin(),
    new MinifyPlugin(
      {},
      {
        comments: false,
      }
    ),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        query: require('./babel.prod.js'), // eslint-disable-line
        include: includePaths,
        exclude: excludePaths,
      },
    ],
  },
};

// Webpack 2 doesn't have a OccurenceOrderPlugin plugin in the production mode.
// But webpack 1 has it. That's why we do this.
if (OccurenceOrderPlugin) {
  config.plugins.unshift(new OccurenceOrderPlugin());
}

export default config;

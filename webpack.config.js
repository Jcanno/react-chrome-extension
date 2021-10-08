/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const outputPath = path.resolve(__dirname, 'dist')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackBar = require('webpackbar')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ExtensionReloader = require('webpack-ext-reloader')
const isDev = process.env.NODE_ENV === 'development'

// copy file to dist
const copyFiles = [
  {
    from: path.resolve('src/manifest.json'),
    to: `${path.resolve('dist')}`,
  },
  {
    from: path.resolve('assets'),
    to: path.resolve('dist/assets'),
  },
]

// all script entry
// custom by your need
const entries = {
  'js/popup': './src/popup/index.tsx',
  'js/content': './src/content/index.tsx',
  'js/background': './src/background/index.ts',
}

// page with html
// custom by your need
const pages = [
  new HtmlWebpackPlugin({
    filename: 'page/popup.html',
    template: 'page/popup.html',
    chunks: ['js/popup'],
  }),
]

// dev hot reload
// https://github.com/SimplifyJobs/webpack-ext-reloader
const hotReload = isDev
  ? [
      new ExtensionReloader({
        reloadPage: true,
        manifest: path.resolve(__dirname, 'src/manifest.json'),
      }),
    ]
  : []

const terser = isDev
  ? []
  : [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ]

const babelOptions = {
  cacheDirectory: true,
  presets: ['@babel/preset-react', ['@babel/preset-env']],
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  // mode: 'development',
  entry: entries,
  output: {
    path: outputPath,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: babelOptions,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    ...pages,
    ...hotReload,
    new CopyWebpackPlugin({
      patterns: copyFiles,
    }),
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: (pathData) => {
        const prefix = 'js/'
        return pathData.chunk.name.includes(prefix)
          ? `css/${pathData.chunk.name.slice(prefix.length)}.css`
          : `css/${pathData.chunk.name}.css`
      },
      chunkFilename: 'css/[name].css',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: !isDev,
    minimizer: terser,
  },
}
